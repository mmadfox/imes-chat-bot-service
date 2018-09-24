module.exports = function validator(scheme) {
  scheme.path('accountId', {
    type: String,
    required: true,
    length: {
      min: 10,
      max: 64
    }
  })
}