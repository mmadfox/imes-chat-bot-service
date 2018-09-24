const uuid = require('node-uuid');
const mongoose = require('mongoose');
const muuid = require('mongoose-uuid2');

muuid(mongoose);
const { UUID } = mongoose.Types;

const deviceSchema = mongoose.Schema({
  _id: {
    type: UUID,
    default: uuid.v4,
  },
  name: { type: String, default: null },
  ownerId: { type: UUID, default: null },
  voice: { type: Boolean, default: false },
  video: { type: Boolean, default: false },
  userAgent: { type: String, default: null },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model('Device', deviceSchema);
