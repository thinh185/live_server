const mongoose = require('mongoose');

const Utils = require('../utils');

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  userId: {
    type: String
  },
  content: {
    type: String
  },
  countViewer: {
    type: Number,
    default: 1
  },
  countHeart: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Utils.getCurrentDateTime()
  },
  updateAt: {
    type: Date,
    default: Utils.getCurrentDateTime()
  }
});

module.exports = mongoose.model('Room', RoomSchema, 'rooms');
