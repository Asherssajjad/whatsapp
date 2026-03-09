const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    phone_number: { type: String, required: true },
    message: { type: String, required: true },
    message_type: { type: String, enum: ['user', 'bot'], required: true },
    message_id: { type: String, unique: true },
    timestamp: { type: Date, default: Date.now },
    conversation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
