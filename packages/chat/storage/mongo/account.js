const uuid = require('node-uuid');
const mongoose = require('mongoose');
const muuid = require('mongoose-uuid2');

muuid(mongoose);
const { UUID } = mongoose.Types;

const accountSchema = mongoose.Schema({
  _id: {
    type: UUID,
    default: uuid.v4,
  },
  userName: { type: String, default: null },
  userPhone: { type: String, default: null },
  userPic: { type: String, default: null },
  contactId: { type: UUID, default: null },
  conversationIds: [{ type: UUID, default: null }],
  private: { type: Boolean, default: true },
  devices: [{ type: UUID, default: null }],
});

module.exports = mongoose.model('Account', accountSchema);
