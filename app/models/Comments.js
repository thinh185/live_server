const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Utils = require('../utils');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  userId: {
    type: String
  },
  username: {
    type: String
  },
  content: {
    type: String
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

CommentSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('CommentSchema', CommentSchema, 'comments');
