module.exports = function validator(scheme) {
  scheme.path('name', {
    type: String,
    required: true,
    length: {
      min: 0,
      max: 250,
    },
  });
};