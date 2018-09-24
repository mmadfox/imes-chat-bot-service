const Queue = require('bull');
const path = require('path');

class MessageGroupQueue {
  static create(config, logger) {
    return new MessageGroupQueue(config, logger);
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
    this.queue = new Queue('group-messages', {
      redis: {
        port: this.config.redis.port,
        host: this.config.redis.host,
      },
    });

    const workerFile = path.resolve(__dirname, 'messageGroupWorker.js');
    this.queue.process(this.workerCount, workerFile);

    if (this.debugMode) {
      console.log('[INFO] messageGroupQueue number of workers %d', this.wc);
      console.log('[INFO] messageGroupQueue worker filename %s', workerFile);
    }
  }
}

module.exports = MessageGroupQueue;