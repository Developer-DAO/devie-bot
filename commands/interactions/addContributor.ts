import { DMChannel, Message, MessageActionRow, MessageButton } from 'discord.js';
import { isContributor, createContributor } from '../../utils/index';

async function captureInformation(filter: (M: Message) => boolean, content: string, dmChannel: DMChannel) {
  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('skip')
        .setLabel('SKIP')
        .setStyle('SECONDARY'),
    );

  const informationMessage = await dmChannel.send({ content, components: [row] });
  const informationResponse = await Promise.race([
    informationMessage.channel.awaitMessages({ filter, max: 1 }),
    informationMessage.channel.awaitMessageComponent({ componentType: 'BUTTON' }),
  ]);
  informationMessage.delete();

  if ('componentType' in informationResponse) {
    console.log('Triggered if the button is pressed');
    return { responded: false }
  }
  else {
    const message = informationResponse.first();
    if (message && message.content) {
      return { responded: true, info: message.content }
    }
    else {
      return { responded: true, info: '' }
    }
  }
}

export async function addContributor(dmChannel: DMChannel) {
    if (await isContributor(dmChannel.recipient)) {
        dmChannel.send('Sorry! You can not add yourself because you are already a contributor!')
        return
    }
    const filter = (m: Message) => dmChannel.recipient.id === m.author.id;
    const nftIDResponse = await captureInformation(filter, 'Please enter your NFT ID if you know it.', dmChannel);
    const twitterHandleResponse = await captureInformation(filter, 'Please enter your twitter handle if you have one.', dmChannel);
    const ethWalletResponse = await captureInformation(filter, 'Please enter your ETH wallet address if you want.', dmChannel);

    const nftID = nftIDResponse.responded ? nftIDResponse.info : '';
    const twitterHandle = twitterHandleResponse.responded ? twitterHandleResponse.info : '';
    const ethWallet = ethWalletResponse.responded ? ethWalletResponse.info : '';

    return await createContributor(dmChannel.recipient, nftID ?? '', twitterHandle ?? '', ethWallet ?? '');
}
