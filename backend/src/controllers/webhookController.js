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
            const changes = body.entry[0].changes[0].value;
            const messageData = changes.messages[0];
            const metadata = changes.metadata;
            const contactProfile = changes.contacts ? changes.contacts[0] : null;
            
            const from = messageData.from; // Sender's phone number
            const contactName = contactProfile ? contactProfile.profile.name : null;
            const text = messageData.text?.body || "Non-text message";
            const messageId = messageData.id;
            const timestamp = messageData.timestamp;
            const recipientPhoneId = metadata.phone_number_id;

            console.log(`New Message from ${from} (${contactName || 'No Name'}) to ${recipientPhoneId}: ${text}`);

            try {
                // Find Organization
                let organization = await prisma.organization.findUnique({
                    where: { whatsapp_phone_id: recipientPhoneId }
                });

                if (!organization) {
                    console.warn(`[Abelops] No organization found for Phone ID: ${recipientPhoneId}. Using fallback mechanism.`);
                    // Try to find the first organization as a catch-all
                    organization = await prisma.organization.findFirst();
                    
                    if (!organization) {
                        console.error('[Abelops] ❌ CRITICAL: No organization found in DB. Webhook execution aborted.');
                        return res.sendStatus(404);
                    }
                }

                const orgId = organization.id;


                // Find or create contact
                let contact = await prisma.contact.findUnique({ 
                    where: { phone_number: from } 
                });
                
                if (!contact) {
                    contact = await prisma.contact.create({
                        data: {
                            phone_number: from,
                            name: contactName,
                            last_message: text,
                            last_message_time: new Date(),
                            organization_id: orgId
                        }
                    });
                } else {
                    contact = await prisma.contact.update({
                        where: { id: contact.id },
                        data: {
                            name: contactName || contact.name,
                            last_message: text,
                            last_message_time: new Date(),
                            unread_count: { increment: 1 },
                            organization_id: orgId // Ensure it's assigned to the currently responding org
                        }
                    });
                }



                // Find or create conversation
                let conversation = await prisma.conversation.findFirst({
                    where: { phone_number: from, status: 'active', organization_id: orgId }
                });
                if (!conversation) {
                    conversation = await prisma.conversation.create({
                        data: { 
                            phone_number: from,
                            organization_id: orgId
                        }
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
                        organization_id: orgId
                    }
                });

                // Emit real-time message via socket.io
                io.emit('new_message', {
                    contact: {
                        ...contact,
                        organization_name: organization.name
                    },
                    message: newMessage,
                });


                // AI Response Logic (Check if auto-reply is enabled)
                if (conversation.ai_reply_enabled) {
                    await generateAndSendAIReply(from, text, conversation.id, io, organization);
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

const generateAndSendAIReply = async (from, text, conversationId, io, organization) => {
    try {
        console.log(`[Abelops Engine] Processing AI Request for Org: ${organization.name} (${from})`);
        
        // Pass organization specific AI token if present
        const aiResponseText = await getAIResponse(text, organization.openai_token);
        console.log(`[Abelops Engine] AI Response Generated for ${organization.name}: "${aiResponseText}"`);

        let messageId = `msg_offline_${Date.now()}`;
        let waStatus = 'LOGGED_ONLY';

        try {
            // Attempt to send response via WhatsApp API using Org credentials
            const waResponse = await sendMessage(
                from, 
                aiResponseText, 
                organization.whatsapp_phone_id, 
                organization.whatsapp_token
            );
            
            if (waResponse && waResponse.messages && waResponse.messages[0]) {
                messageId = waResponse.messages[0].id;
                waStatus = 'SENT';
                console.log(`[Abelops Engine] Message sent via WhatsApp successfully for org ${organization.name}.`);
            }
        } catch (waError) {
            console.error('------------------------------------------------------------');
            console.error(`[Abelops Engine] WHATSAPP API ERROR for Org ${organization.name}: Message could not be sent.`);
            console.error('[Abelops Engine] REASON:', waError.message);
            console.error('[Abelops Engine] ACTION: Falling back to Local Log mode.');
            console.error('[Abelops Engine] AI WOULD HAVE SENT:', aiResponseText);
            console.error('------------------------------------------------------------');
            waStatus = 'FAILED_TOKEN';
        }

        // Save AI response to database regardless of WhatsApp delivery (so user sees it in Dashboard)
        const botMessage = await prisma.message.create({
            data: {
                phone_number: from,
                message: aiResponseText,
                message_type: 'bot',
                message_id: messageId,
                timestamp: new Date(),
                conversation_id: conversationId,
                organization_id: organization.id
            }
        });

        // Emit bot message via socket.io for real-time dashboard updates
        io.emit('new_message', {
            message: botMessage,
        });

    } catch (error) {
        console.error('[Abelops Engine] Critical Error in AI Auto-Reply:', error);
    }
};

module.exports = {
    verifyWebhook,
    handleIncomingMessage,
};
