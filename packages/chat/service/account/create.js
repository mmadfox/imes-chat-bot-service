const AccountModel = require('../../storage/mongo/account');

module.exports = async function create(ctx, request) {
  console.log(ctx, request);
  return request;
};