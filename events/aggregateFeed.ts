export const aggregateFeed = async (reaction: any, client: any, newsfeed: any, aggregator: any, emoji: any) => {
try {
  // When a reaction is received, check if the structure is partial
  if (reaction.partial) {
    await reaction.fetch();
  }

  const { message, _emoji, count } = reaction;
  const { channelId } = message;

  const sendMessage = () => {
    return channelId === newsfeed && _emoji.id === emoji && count === 5;
  };

  if (sendMessage()) {
    const channel = client.channels.cache.get(aggregator);
    const formattedMessage = `Shared by @${message.author.username}\n${message.content}`;
    channel.send(formattedMessage);
  }
}
 catch (error) {
  console.error('Something went wrong when fetching the message:', error);
  return;
}


}