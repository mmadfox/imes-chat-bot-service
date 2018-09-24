const uuid = require('uuid-validate');

const id = val => uuid(val, 4);

module.exports = function validator(scheme) {
  scheme.path('id', {
    type: String,
    required: true,
    use: {
      id,
    },
  });
  scheme.message({
    id: path => `${path} must be a valid uuid.`,
  });
};