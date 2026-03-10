const prisma = require('../lib/prisma');
const { getAIResponse } = require('../logic/aiProvider');
const { sendMessage } = require('../logic/whatsappService');

const verifyWebhook = (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('Incoming Webhook Verification Request:', { mode, token, challenge });

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED: Success');
            return res.status(200).send(challenge);
        } else {
            console.log('WEBHOOK_VERIFIED: Failed. Check VERIFY_TOKEN consistency.');
            return res.sendStatus(403);
        }
    }
    return res.sendStatus(400);
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
                let contact = await prisma.contact.findUnique({ where: { phone_number: from } });
                if (!contact) {
                    contact = await prisma.contact.create({
                        data: {
                            phone_number: from,
                            last_message: text,
                            last_message_time: new Date()
                        }
                    });
                } else {
                    contact = await prisma.contact.update({
                        where: { phone_number: from },
                        data: {
                            last_message: text,
                            last_message_time: new Date(),
                            unread_count: { increment: 1 }
                        }
                    });
                }

                // Find or create conversation
                let conversation = await prisma.conversation.findFirst({
                    where: { phone_number: from, status: 'active' }
                });
                if (!conversation) {
                    conversation = await prisma.conversation.create({
                        data: { phone_number: from }
                    });
                }

                // Save message to database
                const newMessage = await prisma.message.create({
                    data: {
                        phone_number: from,
                        message: text,
                        message_type: 'user',
                        message_id: messageId,
                        timestamp: new Date(timestamp * 1000),
                        conversation_id: conversation.id,
                    }
                });

                // Emit real-time message via socket.io
                io.emit('new_message', {
                    contact,
                    message: newMessage,
                });

                // AI Response Logic (Check if auto-reply is enabled)
                if (conversation.ai_reply_enabled) {
                    await generateAndSendAIReply(from, text, conversation.id, io);
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
        const botMessage = await prisma.message.create({
            data: {
                phone_number: from,
                message: aiResponseText,
                message_type: 'bot',
                message_id: waResponse.messages[0].id,
                timestamp: new Date(),
                conversation_id: conversationId,
            }
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
