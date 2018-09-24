const mongoose = require('mongoose');
const MessageModel = require('../storage/mongo/message');
const ConversationModel = require('../storage/mongo/conversation');

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
      const {
        messageId,
        message,
        conversation,
        source,
        destination,
        date,
        firstConversation,
      } = job.data;

      if (messageId) {
        if (firstConversation) {
          await ConversationModel.create({
            _id: conversation,
            name: '',
            peers: [
              source,
              destination,
            ],
            ownerId: source,
          });
        }

        await MessageModel.create({
          _id: messageId,
          message: message,
          conversationId: conversation,
          sourceId: source,
          destinationId: destination,
          date: date,
        });
      }
      done(null);
    } catch (e) {
      // TODO: add to reTry
      done(e);
    }
  }).catch(done);
};