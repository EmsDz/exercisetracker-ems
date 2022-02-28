const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  log: [Object],
});

module.exports = mongoose.model('User', userSchema);
