module.exports = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  TYPING_TEXT: 'typingText',

  makeChannel(accountId, channelName) {
    return `${channelName}:${accountId}`;
  },
};