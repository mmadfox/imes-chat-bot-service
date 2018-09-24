const {
  createRequest,
  createResponse,
} = require('../../lib/tr');

module.exports = async function deviceAccess(ctx, payload, status) {
  const {
    logger,
    models,
  } = ctx;

  try {
    const request = createRequest(payload, [
      'accountId',
      'deviceId',
    ]);

    const {
      accountId,
      deviceId,
    } = request;

    await ctx.redisStorage.markDeviceOnline(
      accountId,
      deviceId,
      new Date().getTime(),
    );

    const account = await models.Account.findById(accountId);
    const device = account.findDeviceById(deviceId);

    console.log(device);

    const cids = [];
    account.eachContact(c => cids.push(c.id));

    await ctx.replyToFront(ctx.bus)(status, {}, cids);

    return createResponse();
  } catch (e) {
    logger.error(e.toString());
    return e;
  }
};