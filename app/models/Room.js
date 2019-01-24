const mongoose = require('mongoose');

const Utils = require('../utils');

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  roomName: {
    type: String
  },
  streamKey: {
    type: String
  },
  userId: {
    type: String
  },
  liveStatus: {
    type: Number,
    default: 0
  },
  filePath: {
    type: String,
    default: ''
  },
  comments: {
    type: Array
  },
  countViewer: {
    type: Number,
    default: 0
  },
  countLike: {
    type: Number,
    default: 0
  },
  countHeart: {
    type: Number,
    default: 0
  },
  countSad: {
    type: Number,
    default: 0
  },
  countHappy: {
    type: Number,
    default: 0
  },
  countWow: {
    type: Number,
    default: 0
  },
  countUrgy: {
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
