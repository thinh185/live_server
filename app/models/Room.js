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
