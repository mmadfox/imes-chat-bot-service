const validator = require('./index');

const deviceOnlineValidator = validator([
  'members',
]);

if (require.main === module) {
  const vobj2 = deviceOnlineValidator({
    members: ['5f0665b6-ed71-4eab-a5bd-91ff4e8817eb'],
  });

  if (vobj2.valid()) {
    console.log('ok');
  }
}