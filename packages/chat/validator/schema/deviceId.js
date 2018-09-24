module.exports = function validator(scheme) {
  scheme.path('deviceId', {
    type: String,
    required: true,
    length: {
      min: 10,
      max: 64,
    },
  });
};