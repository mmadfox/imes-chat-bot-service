const uuid = require('node-uuid');
const mongoose = require('mongoose');
const muuid = require('mongoose-uuid2');

muuid(mongoose);
const { UUID } = mongoose.Types;

const conversationSchema = mongoose.Schema({
  _id: {
    type: UUID,
    default: uuid.v4,
  },
  name: String,
  ownerId: { type: UUID, default: null },
  peers: [{ type: UUID, default: null }],
});

// todo: add index
// conversationSchema.index({
//  type: -1
// });

module.exports = mongoose.model('Conversation', conversationSchema);
