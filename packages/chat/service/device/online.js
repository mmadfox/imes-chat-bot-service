const deviceAccess = require('./device_access');

const {
  ONLINE,
} = require('../../channels');


module.exports = async function deviceOnline(ctx, request) {
  return deviceAccess(ctx, request, ONLINE);
};