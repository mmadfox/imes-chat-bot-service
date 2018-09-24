const Queue = require('bull');
const path = require('path');

class MessageQueue {
  static create(config, logger) {
    return new MessageQueue(config, logger);
  }

  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.running = false;
    this.queue = null;
    this.wc = 10;
    this.debugMode = false;
  }

  debug() {
    this.debugMode = true;
  }

  setWorkerCount(val) {
    if (val > 100 || val < 5) {
      throw new Error(`have ${val}, want  >= 5 and <= 100`);
    }
    this.wc = val;
    return this;
  }

  add(message = {}) {
    if (!this.running) {
      throw new Error('before add need to run the queue');
    }
    this.queue.add(message);
  }

  close() {
    this.running = false;
    this.queue.close();
  }

  run() {
    if (this.running) {
      return;
    }

    this.running = true;
    this.queue = new Queue('messages', {
      redis: {
        port: this.config.redis.port,
        host: this.config.redis.host,
      },
      defaultJobOptions: {
        mongodb: {
          port: this.config.mongodb.port,
          host: this.config.mongodb.host,
          dbName: this.config.mongodb.dbName,
        },
        removeOnComplete: true,
        removeOnFail: true,
        stackTraceLimit: 3,
        timeout: 3000,
        attempts: 3,
      },
    });

    if (this.debugMode) {
      this.queue.empty();
    }

    const workerFile = path.resolve(__dirname, 'messageWorker.js');

    this.queue.process(this.wc, workerFile);
    this.queue.on('error', (err) => {
      this.logger.error(err.toString());
    });
    this.queue.on('stalled', (msg) => {
      this.logger.info(msg);
    });
    if (this.debugMode) {
      console.log('[INFO] messageQueue number of workers %d', this.wc);
      console.log('[INFO] messageQueue worker filename %s', workerFile);
    }
  }
}

module.exports = MessageQueue;