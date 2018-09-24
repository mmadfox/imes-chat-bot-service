const {
  createRequest,
  createResponse,
} = require('../../lib/tr');

const {
  makeChannel,
} = require('../../channels');

module.exports = async function markReadMessage(ctx, payload) {
  try {
    const request = createRequest(payload, [
      'source',
      'destination',
      'conversation',
    ]);

    await ctx.redisStore.markReadMessage(
      request.source,
      request.conversation,
    );

    const channel = makeChannel(request.destination, 'readMessage');

    await ctx.bus.replyToFront(channel, request);

    return createResponse();
  } catch (e) {
    return e;
  }
};