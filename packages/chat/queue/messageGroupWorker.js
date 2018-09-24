const mongoose = require('mongoose');
const MessageGroupModel = require('../storage/mongo/group_message');

let init = false;

function initMongodb(config) {
  if (init) {
    return Promise.resolve(false);
  }
  const promise = new Promise((resolve, reject) => {
    mongoose.useNewUrlParser = true;
    mongoose.connect(`mongodb://${config.host}:${config.port}/${config.dbName}`, {
      useNewUrlParser: true,
    });
    mongoose.connection.on('error', reject);
    mongoose.connection.on('open', () => {
      init = true;
      resolve(true);
    });
    return null;
  });
  return promise;
}

module.exports = function messageWorker(job, done) {
  initMongodb(job.opts.mongodb).then(async () => {
    try {
      const msg = MessageGroupModel.create({
        message: `message-${job.id}`,
      });
      await msg.save();
      done(null);
    } catch (e) {
      done(e);
    }
  }).catch(done);
};