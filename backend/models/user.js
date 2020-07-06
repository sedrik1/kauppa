const mongoose = require('mongoose');
const uniqueValid = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  authLevel: { type: String, require: true }
});

userSchema.plugin(uniqueValid);

module.exports = mongoose.model('User', userSchema);
