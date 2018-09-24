const uuid = require('uuid-validate');

const conversation = val => uuid(val, 4);

module.exports = function validator(scheme) {
  scheme.path('conversation', {
    type: String,
    required: true,
    use: {
      conversation,
    },
  });
  scheme.message({
    conversation: path => `${path} must be a valid uuid.`,
  });
};