const deviceAccess = require('./device_access');

const {
  OFFLINE,
} = require('../../channels');

module.exports = async function deviceOffline(ctx, request) {
  return deviceAccess(ctx, request, OFFLINE);
};