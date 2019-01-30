const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Utils = require('../utils');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  streamKey: {
    type: String,
    default: 0
  },
  status: {
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
UserSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('User', UserSchema, 'users');
