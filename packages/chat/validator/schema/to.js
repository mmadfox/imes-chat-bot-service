module.exports = function validator(scheme) {
  scheme.path('to', {
    type: Number,
    required: true,
    length: {
      min: 10,
    },
  });
};