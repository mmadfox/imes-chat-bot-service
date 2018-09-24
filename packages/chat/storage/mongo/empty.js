const uuid = require('node-uuid');
const mongoose = require('mongoose');
const muuid = require('mongoose-uuid2');

muuid(mongoose);
const { UUID } = mongoose.Types;

const emptySchema = mongoose.Schema({
  _id: {
    type: UUID,
    default: uuid.v4,
  },
});

module.exports = mongoose.model('Empty', emptySchema);
