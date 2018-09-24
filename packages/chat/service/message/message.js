const uuid = require('node-uuid');

const {
  createRequest,
  createResponse,
} = require('../../lib/tr');

const {
  makeChannel,
} = require('../../channels');

module.exports = async function message(ctx, payload) {
  try {
    let firstConversation = false;

    if (!payload.conversation) {
      payload.conversation = uuid.v4();
      firstConversation = true;
    }

    const request = createRequest(payload, [
      'source',
      'destination',
      'conversation',
      'message',
    ]);

    request.messageId = uuid.v4();
    request.date = new Date();
    request.firstConversation = firstConversation;

    ctx.messageQueue.add(request);
    const channel = makeChannel(request.destination, 'message');

    await ctx.redisStorage.markUnreadMessage(
      request.destination,
      request.conversation,
    );

    await ctx.bus.replyToFront(channel, request);

    return createResponse({
      messageId: request.conversation,
      conversation: request.messageId,
    });
  } catch (e) {
    if (ctx.debug) {
      console.log(e);
    }
    return e;
  }
};