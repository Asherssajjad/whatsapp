const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    phone_number: { type: String, required: true },
    ai_reply_enabled: { type: Boolean, default: true },
    last_interaction: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
