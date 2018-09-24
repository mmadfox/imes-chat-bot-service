const {
  createRequest,
  createResponse,
} = require('../../lib/tr');

module.exports = async function joinToGroup(ctx, payload) {
  try {
    const request = createRequest(payload, [
      'id',
      'peers',
    ]);

    const groupConversation = await ctx.models.GroupConversation.findOne({
      _id: request.id,
    });

    if (!groupConversation) {
      throw new Error(`group ${request.id} not found`);
    }

    await ctx.replyToFront(ctx.bus)('createGroup', {

    }, request.peers);

    return createResponse();
  } catch (e) {
    return e;
  }
};