const Client = require('./hemera-bus-client');

class Bus {
  static create(hemera, name, context = {}) {
    return new Bus(hemera, name, context);
  }

  constructor(hemera, name, context = {}) {
    this.hemera = hemera;

    this.context = context;
    this.bus = new Client(hemera);
    this.context.bus = this.bus;
    this.name = name;

    this.methods = {};
    this.service = {};
    this.debugMode = false;
  }

  debug() {
    this.debugMode = true;
  }

  register(ns, methods) {
    if (Array.isArray(ns)) {
      methods = ns;
    }
    if (!this.methods[ns]) {
      this.methods[ns] = {};
    }
    methods.forEach((fn) => {
      if (fn === undefined) {
        if (this.debugMode) {
          console.log('[ERROR] register failed. undefined service action');
        }
        return;
      }
      const typeFn = typeof fn;
      if (typeFn !== 'function' && typeFn !== 'object') {
        throw new Error(`have ${typeFn}, expected function type`);
      }
      if (typeFn === 'object') {
        Object.keys(fn).forEach((method) => {
          if (this.debugMode) {
            console.log('[INFO] register service action %s', method);
          }
          this.methods[ns][method] = fn[method];
        });
      } else {
        if (this.debugMode) {
          console.log('[INFO] register service action %s', fn.name);
        }
        this.methods[ns][fn.name] = fn;
      }
    });
  }

  connectToBus() {
    if (!this.name) {
      throw new Error('service name is required.');
    }
    Object.keys(this.methods).forEach((ns) => {
      Object.keys(this.methods[ns]).forEach((name) => {
        this.service[name] = this.methods[ns][name];
      });
    });
    Object.keys(this.service).forEach((methodName) => {
      const factory = this.service[methodName];
      if (this.debugMode) {
        console.log('[INFO] listen %s:%s', this.name, methodName);
      }
      this.hemera.add({
        topic: this.name,
        cmd: methodName,
      }, (request, done) => {
        // TODO: add middleware
        if (!request.payload) {
          done(new Error('bad request'));
          return;
        }
        factory(this.context, request.payload).then((response) => {
          if (response instanceof Error) {
            done(response);
          } else {
            console.log('RESP>', response);
            done(null, response);
          }
        }).catch(done);
      });
    });
    this.methods = {};
  }
}

module.exports = Bus;