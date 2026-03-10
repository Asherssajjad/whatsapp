const prisma = require('../lib/prisma');
const { sendMessage } = require('../logic/whatsappService');

const getContacts = async (req, res) => {
    try {
        const contacts = await prisma.contact.findMany({
            orderBy: { last_message_time: 'desc' }
        });
        res.status(200).json(contacts);
    } catch (err) {
        console.error('Error fetching contacts:', err);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
};

const getMessages = async (req, res) => {
    const { phone_number } = req.params;
    try {
        const messages = await prisma.message.findMany({
            where: { phone_number },
            orderBy: { timestamp: 'asc' }
        });
        res.status(200).json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

const sendManualMessage = async (req, res) => {
    const { phone_number, message } = req.body;
    const io = req.app.get('socketio');

    try {
        const waResponse = await sendMessage(phone_number, message);

        // Save to database
        const botMessage = await prisma.message.create({
            data: {
                phone_number,
                message,
                message_type: 'bot',
                message_id: waResponse.messages[0].id,
                timestamp: new Date(),
            }
        });

        // Notify dashboard
        io.emit('new_message', {
            message: botMessage,
        });

        res.status(200).json(botMessage);
    } catch (err) {
        console.error('Error sending manual message:', err);
        res.status(500).json({ error: 'Failed to send manual message' });
    }
};

module.exports = {
    getContacts,
    getMessages,
    sendManualMessage,
};
