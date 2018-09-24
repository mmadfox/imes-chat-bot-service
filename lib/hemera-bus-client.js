class Client {
  constructor(hemera) {
    this.hemera = hemera;
  }

  request(action, payload = {}) {
    return new Promise((resolve, reject) => {
      if (typeof action === 'string') {
        const o = action.split(':');
        if (o.length !== 2) {
          reject(new Error(`invalid action ${action} type. use: topic:cmd`));
        }
        action = {
          topic: o[0],
          cmd: o[1],
          payload: payload,
        };
      }
      if (typeof action !== 'object' || !action.topic || !action.cmd) {
        reject(new Error('invalid action object'));
      }
      action.payload = payload;
      this.hemera.act(action, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  replyToFront(channel, request = {}) {
    return new Promise((resolve, reject) => {
      this.hemera.act({
        pubsub$: true,
        topic: '@front',
        payload: {
          channelName: channel,
          message: request,
        },
      }, (err, resp) => {
        if (err) {
          reject(err, null);
        } else {
          resolve(resp);
        }
      });
    });
  }
}

module.exports = Client;