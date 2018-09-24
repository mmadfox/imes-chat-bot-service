const minimist = require('minimist');
const Bus = require('../lib/hemera-bus');
const {
  Account,
  deviceOnline,
  deviceOffline,
  groupMessage,
  message,
  typingText,
  history,
  joinToGroup,
  leaveGroup,
  createGroup,
} = require('../packages/chat/service');
const loadConfig = require('../packages/chat/lib/loadConfig');
const bootstrap = require('../packages/chat/bootstrap');
const RedisStorage = require('../packages/chat/storage/redis');
const RedisCache = require('../packages/chat/cache/redis');
const MongoModels = require('../packages/chat/storage/mongo');
const reply = require('../packages/chat/lib/reply');
const MessageQueue = require('../packages/chat/queue/messageQueue');
const MessageGroupQueue = require('../packages/chat/queue/messageGroupQueue');

module.exports = async function command() {
  try {
    const argv = minimist(this.parent.rawArgs.slice(2));
    const config = loadConfig(argv.config);
    const services = await bootstrap(config);

    const msgQueue = MessageQueue.create({
      redis: config.redisCache,
      mongodb: config.mongodb,
    }, services.logger);
    msgQueue.setWorkerCount(config.messageQueue.workers);

    const msgGroupQueue = MessageGroupQueue.create({
      redis: config.redisCache,
      mongodb: config.mongodb,
    }, services.logger);
    msgGroupQueue.setWorkerCount(config.messageQueue.workers);

    const node = Bus.create(services.hemera, config.serviceId, {
      // hot db cluster
      redisStorage: RedisStorage.create(services.redis),
      // cache per instance
      redisCache: RedisCache.create(services.redisCache),
      // all models for service
      models: MongoModels,
      // winston logger with udp and file transport
      logger: services.logger,
      // helper
      replyToFront: reply,
      // messages redis queue
      messageQueue: msgQueue,
      // group messages queue
      messageGroupQueue: msgGroupQueue,

      debug: argv.debug,
    });

    if (argv.debug) {
      msgQueue.debug();
      msgGroupQueue.debug();
      node.debug();
    }

    node.register([
      // TODO: refactor to Account.registerAccount or account.registerAccount
      Account,
      deviceOnline,
      deviceOffline,
      message,
      groupMessage,
      typingText,
      history,
      createGroup,
      joinToGroup,
      leaveGroup,
    ]);

    msgQueue.run();
    msgGroupQueue.run();

    node.connectToBus();
  } catch (e) {
    console.error(e);
  }
};