class RedisStorage {
  static create(conn) {
    return new RedisStorage(conn);
  }

  /**
   * @param {Redis}
   */
  constructor(conn) {
    this.conn = conn;
  }

  /**
   * @param {String}
   * @param {String}
   * @param {String}
   */
  set(ns, key, value) {
    return new Promise((resolve, reject) => {
      this.conn.hset(ns, key, value, (err, status) => {
        if (err) {
          reject(err);
        } else {
          resolve(status);
        }
      });
    });
  }

  /**
   * @param {String}
   * @param {String}
   */
  get(ns, key) {
    return new Promise((resolve, reject) => {
      this.conn.hget(ns, key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  markDeviceOnline(accountId, deviceId, timeStamp) {
    const ns = `imes:${accountId}`;
    const key = `online:${deviceId}`;
    return this.set(ns, key, timeStamp);
  }

  markUnreadMessage(accountId, conversationId) {
    const ns = `imes:${accountId}`;
    const key = `unread:${conversationId}`;
    const ts = new Date().getTime();
    return this.set(ns, key, ts);
  }

  markReadMessage(accountId, conversationId) {
    const ns = `imes:${accountId}`;
    const key = `unread:${conversationId}`;
    const ts = 0;
    return this.set(ns, key, ts);
  }

  lastSeenOnline(accountId, deviceId) {
    const ns = `imes:${accountId}`;
    const key = `online:${deviceId}`;
    return this.get(ns, key);
  }
}

module.exports = RedisStorage;