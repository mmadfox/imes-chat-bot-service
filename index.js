#!/usr/bin/env node

const program = require('commander');

program
  .command('v1')
  .option('--config', 'the configuration file')
  .option('--debug', 'enable debug mode')
  .description('run imes-chat.service')
  .action(require('./command/service.v1'));

program
  .arguments('test <cmd> [env]')
  .description('test imes-chat.service')
  .action(require('./command/test'));

program
  .command('fakebroker')
  .description('fake broker imes-chat.service')
  .action(require('./command/fake_broker'));

program.parse(process.argv);