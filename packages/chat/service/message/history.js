const moment = require('moment');

const {
  createRequest,
  createResponse,
} = require('../../lib/tr');

const compare = (a, b) => {
  if (a.date.getTime() < b.date.getTime()) {
    return -1;
  }
  if (a.date.getTime() > b.date.getTime()) {
    return 1;
  }
  return 0;
};

module.exports = async function history(ctx, payload) {
  try {
    const request = createRequest(payload, [
      'source',
      'destination',
      'from',
      'to',
    ]);

    // TODO: validate date
    const fromDate = moment(request.from);
    const toDate = moment(request.to);

    const messages = await ctx.models.Message.fetchHistory(
      request.source,
      request.destination,
      fromDate.toDate(),
      toDate.toDate(),
    );

    messages.sort(compare);

    return createResponse({
      history: messages,
    });
  } catch (e) {
    if (ctx.debug) {
      console.error(e);
    }
    return e;
  }
};