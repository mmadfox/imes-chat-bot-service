const uuid = require('node-uuid');
const mongoose = require('mongoose');
const muuid = require('mongoose-uuid2');

muuid(mongoose);
const {
  UUID,
} = mongoose.Types;

const messageSchema = mongoose.Schema({
  _id: {
    type: UUID,
    default: uuid.v4,
  },

  message: String,

  conversationId: {
    type: UUID,
    default: null,
  },

  sourceId: {
    type: UUID,
    default: null,
  },

  destinationId: {
    type: UUID,
    default: null,
  },

  date: Date,
});

messageSchema.statics.fetchHistory = function fetchHistory(src, dst, from, to) {
  const query = {
    sourceId: src,
    destinationId: dst,
    date: {
      $lt: to,
      $gte: from,
    },
  };
  return this.find(query);
};

messageSchema.index({
  sourceId: 1,
  destinationId: 1,
  date: 1,
});

module.exports = mongoose.model('Message', messageSchema);