module.exports = function groupMessage(ctx, request) {
  console.log('groupMessage');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        ttt: true,
      });
    }, 1000);
  });
}