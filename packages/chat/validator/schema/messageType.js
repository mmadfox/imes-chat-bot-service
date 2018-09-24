module.exports = function validator(scheme) {
  scheme.path('destination', {
    type: String,
    length: {
      min: 10,
      max: 64
    }
  });
}