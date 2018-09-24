const Schema = require('validate');

const accountId = require('./schema/accountId');
const deviceId = require('./schema/deviceId');
const destination = require('./schema/destination');
const messagesType = require('./schema/messageType');
const source = require('./schema/source');
const conversation = require('./schema/conversation');
const message = require('./schema/message');
const from = require('./schema/from');
const to = require('./schema/to');
const name = require('./schema/name');
const peers = require('./schema/peers');

const driversMap = {
  accountId: accountId,
  deviceId: deviceId,
  destination: destination,
  source: source,
  messagesType: messagesType,
  conversation: conversation,
  message: message,
  to: to,
  from: from,
  name: name,
  peers: peers,
};

const errorsObj = {
  total: 0,
  messages: [],

  valid() {
    return this.total === 0;
  },

  invalid() {
    return this.total > 0;
  },
};

module.exports = function validator(drivers) {
  if (!Array.isArray(drivers)) {
    drivers = [drivers];
  }
  return function validate(request) {
    const cp = Object.create(request);
    const eo = Object.assign({}, errorsObj, {});
    const schema = new Schema();

    drivers.forEach((driver) => {
      if (!request[driver]) {
        throw new Error('bad request');
      }
      const v = driversMap[driver];
      if (typeof v !== 'function') {
        return;
      }
      v(schema);
    });

    const errors = schema.validate(cp);
    if (errors.length > 0) {
      eo.total = errors.length;
      eo.messages = errors;
    }
    return eo;
  };
};