const {
  createRequest,
  createResponse,
} = require('../../lib/tr');

module.exports = async function leaveGroup(ctx, payload) {
  try {
    const request = createRequest(payload, [
      'id',
      'peers',
    ]);

    return createResponse();
  } catch (e) {
    return e;
  }
};