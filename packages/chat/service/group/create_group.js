const uuid = require('node-uuid');

const {
  createRequest,
  createResponse,
} = require('../../lib/tr');

module.exports = async function createGroup(ctx, payload) {
  try {
    const request = createRequest(payload, [
      'accountId',
      'name',
      'peers',
    ]);

    const groupId = uuid.v4();
    const createdAt = new Date();

    await ctx.models.GroupConversation.create({
      _id: groupId,
      name: request.name,
      ownerId: request.accountId,
      peers: request.peers,
      createdAt: createdAt,
    });

    await ctx.replyToFront(ctx.bus)('createGroup', {
      groupId: groupId,
      totalPeers: request.peers.length,
      createdAt: createdAt,
    }, request.peers);

    return createResponse();
  } catch (e) {
    return e;
  }
};