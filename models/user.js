const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 99
  },
  email: { // TODO: Need to add email validation
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 99
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 99
  },
  lists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
  }],
});

userSchema.set('toJSON', {
  transform: (doc, user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
  }),
});

userSchema.methods.isAuthenticated = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function(next){
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


module.exports = mongoose.model('User', userSchema);
