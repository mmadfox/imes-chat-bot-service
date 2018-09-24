const moment = require('moment');
const Hemera = require('nats-hemera');
const nats = require('nats');
const minimist = require('minimist');
const Client = require('../lib/hemera-bus-client');

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

const source = '9a02dc4b-0e17-436a-93cf-1aa176c05b64';
const destination = '8e697ad8-4d6b-4600-89f9-cc63f39170ff';

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array);
  }
}

const typingText = async (client, args) => {
  const fire = [];
  for (let i = 0; i < 10000; i += 1) {
    fire.push(() => {
      const p = client.request('chat:typignText', {
        source: args.from,
        destination: args.to,
        accountId: args.from,
        deviceId: 1,
      });
      return p;
    });
  }
  await asyncForEach(fire, async (p) => {
    await waitFor(10);
    p().then((response) => {
      console.log(response);
    }).catch(err => console.error(err));
  });
};

const sendMessage = (client, args) => {
  return new Promise((resolve, reject) => {
    client.hemera.act({
      topic: 'chat',
      cmd: 'message',
      payload: {
        source: args.from,
        destination: args.to,
        message: 'Hello',
      },
    }, (err, response) => {
      if (err) {
        reject(err);
      } else {
        console.log('CLI RESP', response);
        resolve(response);
      }
    });
  });
};

const history = (client, args) => {
  const from = moment().subtract(7, 'days');
  const to = moment().add(1, 'days');
  return new Promise((resolve, reject) => {
    client.hemera.act({
      topic: 'chat',
      cmd: 'history',
      payload: {
        source: args.from,
        destination: args.to,
        from: from.valueOf(),
        to: to.valueOf(),
      },
    }, (err, response) => {
      if (err) {
        reject(err);
      } else {
        console.log('CLI RESP', response);
        response.payload.history.forEach((msg) => {
          console.log(msg, msg.date);
        });
        resolve(response);
      }
    });
  });
};

const actions = [
  typingText,
  sendMessage,
  history,
];

module.exports = async function command(_, cmd) {
  const argv = minimist(this.rawArgs.slice(2));

  const natsCon = nats.connect();
  const hemera = new Hemera(natsCon, {
    logLevel: 'info',
  });
  hemera.ready((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    setTimeout(() => {
      const client = new Client(hemera);
      let foundAction = null;
      actions.forEach((act) => {
        if (act.name === cmd) {
          foundAction = act;
        }
      });
      if (foundAction) {
        if (argv.to === 1 || !argv.to) {
          argv.to = destination;
        }
        if (argv.from === 2 || !argv.from) {
          argv.from = source;
        }
        if (argv.from === 1) {
          argv.from = source;
        }
        if (argv.to === 2) {
          argv.to = destination;
        }
        foundAction(client, argv).then(() => {
          process.exit(0);
        });
      }
    }, 3000);
  });
  process.on('exit', () => {
    natsCon.close();
  });
};