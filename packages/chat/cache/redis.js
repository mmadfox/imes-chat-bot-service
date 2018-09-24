class RedisCache {
  static create(conn) {
    return new RedisCache(conn);
  }

  constructor(conn) {
    this.conn = conn;
  }
}

module.exports = RedisCache;