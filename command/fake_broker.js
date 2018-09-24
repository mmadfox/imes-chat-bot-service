const Hemera = require('nats-hemera');
const nats = require('nats');

module.exports = async function command() {
  const natsCon = nats.connect();
  const hemera = new Hemera(natsCon, {
    logLevel: 'info',
  });
  hemera.ready((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    hemera.add({
      pubsub$: true,
      topic: '@front',
    }, (req) => {
      console.log(req);
    });
  });
};