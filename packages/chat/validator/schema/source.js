const uuid = require('uuid-validate');

const source = val => uuid(val, 4);

module.exports = function validator(scheme) {
  scheme.path('source', {
    type: String,
    required: true,
    use: {
      source,
    },
  });
  scheme.message({
    source: path => `${path} must be a valid uuid.`,
  });
};