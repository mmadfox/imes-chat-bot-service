const uuid = require('uuid-validate');

const destination = val => uuid(val, 4);

module.exports = function validator(scheme) {
  scheme.path('destination', {
    type: String,
    required: true,
    use: {
      destination,
    },
  });
  scheme.message({
    destination: path => `${path} must be a valid uuid.`,
  });
};