const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  phone_number: { type: String, required: true, unique: true },
  name: { type: String, default: 'Unknown' },
  avatar: { type: String, default: '' },
  last_message: { type: String, default: '' },
  last_message_time: { type: Date, default: Date.now },
  unread_count: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
