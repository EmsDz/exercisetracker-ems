const mongoose = require('mongoose');

let exerciseSessionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: String,
});

module.exports = mongoose.model('Session', exerciseSessionSchema);
