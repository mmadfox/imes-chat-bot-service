const uuid = require('uuid-validate');

const peers = (val) => {
  let ok = true;
  for (let i = 0, len = val.length; i < len; i += 1) {
    const valid = uuid(val[i], 4);
    if (!valid) {
      ok = false;
      break;
    }
  }
  return ok;
};

module.exports = function validator(scheme) {
  scheme.path('peers', {
    type: Array,
    required: true,
    use: {
      peers,
    },
  });
  scheme.message({
    peers: path => `${path} must be a valid uuid.`,
  });
};