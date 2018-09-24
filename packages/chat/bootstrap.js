const Hemera = require('nats-hemera');
const nats = require('nats');
const nohm = require('nohm').Nohm;
const redis = require('redis');
const mongoose = require('mongoose');
const winston = require('winston');

const redisInit = (config = {}) => {
  const promise = new Promise((resolve, reject) => {
    const conn = redis.createClient({
      host: config.host,
      port: config.port,
    });
    conn.on('error', (err) => {
      reject(err);
    });
    conn.on('connect', () => {
      nohm.setClient(conn);
      resolve({
        service: 'redis',
        instance: conn,
        init: true,
      });
    });
    process.on('exit', () => {
      conn.quit();
    });
  });
  return promise;
};

const redisCacheInit = (config = {}) => {
  const promise = new Promise((resolve, reject) => {
    const conn = redis.createClient({
      host: config.host,
      port: config.port,
    });
    conn.on('error', (err) => {
      reject(err);
    });
    conn.on('connect', () => {
      nohm.setClient(conn);
      resolve({
        service: 'redis',
        instance: conn,
        init: true,
      });
    });
    process.on('exit', () => {
      conn.quit();
    });
  });
  return promise;
};

const mongoInit = (config = {}) => {
  const promise = new Promise((resolve, reject) => {
    mongoose.useNewUrlParser = true;
    mongoose.connect(`mongodb://${config.host}:${config.port}/${config.dbName}`, {
      useNewUrlParser: true,
    });
    mongoose.connection.on('error', reject);
    mongoose.connection.on('open', () => {
      resolve({
        service: 'mongo',
        init: true,
        instance: mongoose.connection,
      });
    });
    process.on('exit', () => {
      mongoose.connection.close();
    });
  });
  return promise;
};

const natsInit = () => {
  const promise = new Promise((resolve, reject) => {
    const natsCon = nats.connect();
    const hemera = new Hemera(natsCon, {
      logLevel: 'info',
      timeout: 7000,
    });
    hemera.ready((err) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          service: 'hemera',
          instance: hemera,
          init: true,
        });
      }
    });
    process.on('exit', () => {
      natsCon.close();
    });
  });
  return promise;
};

const loggerInit = () => {
  const promise = new Promise((resolve) => {
    const logger = winston.createLogger({
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
      ],
    });
    resolve({
      service: 'logger',
      instance: logger,
      init: true,
    });
  });
  return promise;
};

const extract = (services) => {
  const instaces = {};
  services.forEach((s) => {
    if (!s.init) {
      throw new Error(`service is down ${s.service}`);
    }
    instaces[s.service] = s.instance;
  });
  return instaces;
};

module.exports = async function init(config) {
  const boot = await Promise.all([
    redisInit(config.redis || {}),
    natsInit(config.nats || {}),
    mongoInit(config.mongodb || {}),
    loggerInit(config.logger || {}),
    redisCacheInit(config.redisCache || {}),
  ]);

  const services = extract(boot);

  return services;
};