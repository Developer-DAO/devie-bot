import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { ResourceBuilder, isContributor, isValidUrl, findContributor, createResource } from '../utils';
import { setAuthorSelection, setCategorySelection, setBlockchainSelection, setTagSelection } from './menuSelections';
import { addContributor } from './interactions'

export const data = new SlashCommandBuilder()
    .setName('add-resource-extended')
    .setDescription('Adds a resource to the Developer DAO knowledge base')
    .addStringOption(
        option => option.setRequired(true)
        .setName('url')
        .setDescription('Enter a link to a resource'))
    .addStringOption(
      option => option.setRequired(true)
      .setName('title')
      .setDescription('Enter the resource title'))
    .addStringOption(
      option => option.setRequired(true)
      .setName('summary')
      .setDescription('Enter the resource summary'))
    .addStringOption(option =>
      option.setName('level')
        .setDescription('The resource level')
        .setRequired(true)
        .addChoice('Beginner', 'Beginner')
        .addChoice('Intermediate', 'Intermediate')
        .addChoice('Advanced', 'Advanced'))
    .addStringOption(option =>
      option.setName('media')
        .setDescription('Media type')
        .setRequired(true)
        .addChoice('Article', 'Article')
        .addChoice('Video', 'Video')
        .addChoice('Paid Course', 'Paid Course')
        .addChoice('Free Course', 'Free Course'));

function ConfigureEmbed(embed: MessageEmbed, resource: ResourceBuilder): MessageEmbed {
  embed.setAuthor(resource.author?.name ?? 'Author');
  embed.setTitle(resource.title ?? 'Title');
  embed.setURL(resource.source ?? 'Source');
  embed.setDescription(resource.summary ?? 'Summary');
  embed.setFields([
    { name: 'level', value: resource.level ?? 'Level', inline: true },
    { name: 'mediatype', value: resource.mediaType ?? 'Media Type', inline: true },
    { name: 'blockchain', value: resource.blockchain ? resource.blockchain.map(b => b.name).join(', ') : 'Blockchain', inline: false },
    { name: 'category', value: resource.category ? resource.category.map(c => c.name).join(', ') : 'Category', inline: true },
  ]);
  embed.setFooter(`Tags: ${resource.tags ? resource.tags.map(t => t.name).join(', ') : ''}`)

  return embed;
}

function UpdateEmbed(embed: MessageEmbed, embedMessage: Message, resource: ResourceBuilder): void {
  const updatedEmbed = ConfigureEmbed(new MessageEmbed(embed), resource);
  embedMessage.edit({ embeds: [updatedEmbed] })
}

export async function execute(interaction: CommandInteraction) {
  const source = interaction.options.getString('url') ?? '';
  const title = interaction.options.getString('title') ?? '';
  const summary = interaction.options.getString('summary') ?? '';
  const level = interaction.options.getString('level') ?? '';
  const mediaType = interaction.options.getString('media') ?? '';

  const userInput = interaction.options.getString('url')
  if (userInput === undefined || userInput == null) {
      return;
    }

    if (isValidUrl(source)) {
        const newResource = new ResourceBuilder();
        newResource.source = source;
        newResource.title = title;
        newResource.summary = summary;
        newResource.level = level;
        newResource.mediaType = mediaType;

        await interaction.reply({ content: 'Please complete the addition process in the DM you just received', ephemeral: true });
        const dmChannel = await interaction.user.createDM();

        if (!await isContributor(interaction.user)) {
          newResource.contributor = await addContributor(dmChannel);
        }
        else {
          const contributorResponse = await findContributor(dmChannel.recipient);
          if (contributorResponse) {
            newResource.contributor = contributorResponse.getId();
          }
        }

        await dmChannel.send('Please enter more information about the article');

        const resourceEmbed = ConfigureEmbed(new MessageEmbed(), newResource);
        const embedMessage = await dmChannel.send({ embeds: [resourceEmbed] });
        const authorResponses = await setAuthorSelection(dmChannel);
        newResource.author = authorResponses[0];
        UpdateEmbed(resourceEmbed, embedMessage, newResource);

        const blockchainResponses = await setBlockchainSelection(dmChannel);
        newResource.blockchain = blockchainResponses;
        UpdateEmbed(resourceEmbed, embedMessage, newResource);

        const categoryResponses = await setCategorySelection(dmChannel);
        newResource.category = categoryResponses;
        UpdateEmbed(resourceEmbed, embedMessage, newResource);

        const tagsResponses = await setTagSelection(dmChannel);
        newResource.tags = tagsResponses;
        UpdateEmbed(resourceEmbed, embedMessage, newResource);

        const resource = newResource.build();
        const REPLY = {
          YES: 'yes',
          NO: 'no',
        };

        const noButton = new MessageButton()
          .setCustomId(REPLY.NO)
          .setLabel('Cancel')
          .setStyle('DANGER');
        const yesButton = new MessageButton()
          .setCustomId(REPLY.YES)
          .setLabel('Add resource')
          .setStyle('PRIMARY');
        const buttonRow = new MessageActionRow()
          .addComponents(
            noButton,
            yesButton,
          );

        await embedMessage.edit({
          components: [buttonRow],
        });

        const buttonReply = await dmChannel.awaitMessageComponent({ componentType: 'BUTTON' });
        if (!buttonReply) {
          return;
        }

        const buttonSelected = buttonReply.customId;
        buttonReply.update({ embeds: [resourceEmbed], components: [] });
        if (buttonSelected === REPLY.NO) {
          buttonReply.followUp({
            content: `"${resource.title}" was not added`,
            ephemeral: true,
          })
          return;
        }
        else {
          const result = await createResource(resource);
          if (result.success) {
            const messageDetails = {
              content: 'Resource was added. Thank you for your contribution',
              embeds: [],
              components: [],
            };

            interaction.editReply(messageDetails);
            embedMessage.edit(messageDetails);
          }
          else {
            const messageDetails = {
              content: 'Resource addition failed. ${error}',
              embeds: [],
              components: [],
            };
            interaction.editReply(messageDetails);
            embedMessage.edit(messageDetails);
          }
        }
    }
    else {
      await interaction.reply({ content: 'Invalid URL! Please try again.', ephemeral: true })
      return
    }
}
