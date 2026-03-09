const Contact = require('../models/Contact');
const Message = require('../models/Message');
const { sendMessage } = require('../services/whatsappService');

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ last_message_time: -1 });
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
};

const getMessages = async (req, res) => {
    const { phone_number } = req.params;
    try {
        const messages = await Message.find({ phone_number }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

const sendManualMessage = async (req, res) => {
    const { phone_number, message } = req.body;
    const io = req.app.get('socketio');

    try {
        const waResponse = await sendMessage(phone_number, message);

        // Save to database
        const botMessage = await Message.create({
            phone_number,
            message,
            message_type: 'bot',
            message_id: waResponse.messages[0].id,
            timestamp: new Date(),
        });

        // Notify dashboard
        io.emit('new_message', {
            message: botMessage,
        });

        res.status(200).json(botMessage);
    } catch (err) {
        res.status(500).json({ error: 'Failed to send manual message' });
    }
};

module.exports = {
    getContacts,
    getMessages,
    sendManualMessage,
};
