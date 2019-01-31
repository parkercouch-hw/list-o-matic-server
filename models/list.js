const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  posterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completed: Boolean,
});

var listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 99
  },
  key: {
    type: String,
    required: true,
    unique: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [itemSchema],
});

module.exports = mongoose.model('List', listSchema);
