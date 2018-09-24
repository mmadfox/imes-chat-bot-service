const path = require('path');
const fs = require('fs');

module.exports = function load(filepath = null) {
  if (!filepath) {
    filepath = path.join(`${__dirname}../../../../config.json`);
  }

  const data = fs.readFileSync(filepath);
  const json = JSON.parse(data);

  return json;
};