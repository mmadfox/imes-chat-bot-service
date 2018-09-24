module.exports = function validator(scheme) {
  scheme.path('message', {
    type: String,
    required: true,
    length: {
      max: 2000,
    },
  });
};