const {
  createRequest,
  createResponse,
} = require('../../lib/tr');

const {
  makeChannel,
} = require('../../channels');

module.exports = async function typignText(ctx, payload) {
  try {
    console.log('typignText ok');

    const request = createRequest(payload, [
      'destination',
      'source',
    ]);
    const channel = makeChannel(request.destination, 'typingText');
    ctx.bus.replyToFront(channel, request);
    return createResponse();
  } catch (e) {
    return e;
  }
};