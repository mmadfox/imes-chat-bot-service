module.exports = function validator(scheme) {
  scheme.path('from', {
    type: Number,
    required: true,
    length: {
      min: 10,
    },
  });
};