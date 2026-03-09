const Message = require('../models/Message');
const Contact = require('../models/Contact');
const Conversation = require('../models/Conversation');
const { getAIResponse } = require('../services/openaiService');
const { sendMessage } = require('../services/whatsappService');

const verifyWebhook = (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
};

const handleIncomingMessage = async (req, res) => {
    const body = req.body;
    const io = req.app.get('socketio');

    if (body.object) {
        if (
            body.entry &&
            body.entry[0].changes &&
            body.entry[0].changes[0].value.messages &&
            body.entry[0].changes[0].value.messages[0]
        ) {
            const messageData = body.entry[0].changes[0].value.messages[0];
            const from = messageData.from; // Sender's phone number
            const text = messageData.text.body;
            const messageId = messageData.id;
            const timestamp = messageData.timestamp;

            console.log(`New Message from ${from}: ${text}`);

            try {
                // Find or create contact
                let contact = await Contact.findOne({ phone_number: from });
                if (!contact) {
                    contact = await Contact.create({ phone_number: from, last_message: text, last_message_time: new Date() });
                } else {
                    contact.last_message = text;
                    contact.last_message_time = new Date();
                    contact.unread_count += 1;
                    await contact.save();
                }

                // Find or create conversation
                let conversation = await Conversation.findOne({ phone_number: from, status: 'active' });
                if (!conversation) {
                    conversation = await Conversation.create({ phone_number: from });
                }

                // Save message to database
                const newMessage = await Message.create({
                    phone_number: from,
                    message: text,
                    message_type: 'user',
                    message_id: messageId,
                    timestamp: new Date(timestamp * 1000),
                    conversation_id: conversation._id,
                });

                // Emit real-time message via socket.io
                io.emit('new_message', {
                    contact,
                    message: newMessage,
                });

                // AI Response Logic (Check if auto-reply is enabled)
                if (conversation.ai_reply_enabled) {
                    await generateAndSendAIReply(from, text, conversation._id, io);
                }

                res.status(200).send('EVENT_RECEIVED');
            } catch (error) {
                console.error('Error handling incoming message:', error);
                res.status(500).send('ERROR');
            }
        } else {
            res.sendStatus(404);
        }
    }
};

const generateAndSendAIReply = async (from, text, conversationId, io) => {
    try {
        const aiResponseText = await getAIResponse(text);

        // Send response via WhatsApp API
        const waResponse = await sendMessage(from, aiResponseText);

        // Save AI response to database
        const botMessage = await Message.create({
            phone_number: from,
            message: aiResponseText,
            message_type: 'bot',
            message_id: waResponse.messages[0].id,
            timestamp: new Date(),
            conversation_id: conversationId,
        });

        // Emit bot message via socket.io
        io.emit('new_message', {
            message: botMessage,
        });

        console.log('AI Response Sent:', aiResponseText);
    } catch (error) {
        console.error('Error in AI auto-reply:', error);
    }
};

module.exports = {
    verifyWebhook,
    handleIncomingMessage,
};
