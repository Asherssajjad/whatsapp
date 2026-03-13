const prisma = require('../lib/prisma');
const { sendMessage } = require('../logic/whatsappService');

const getContacts = async (req, res) => {
    const orgId = req.headers['x-org-id'];
    try {
        const query = orgId ? { where: { organization_id: orgId } } : {};
        const contacts = await prisma.contact.findMany({
            ...query,
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
    const orgId = req.headers['x-org-id'];
    try {
        const query = { phone_number };
        if (orgId) query.organization_id = orgId;
        
        const messages = await prisma.message.findMany({
            where: query,
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
    const orgId = req.headers['x-org-id'];
    const io = req.app.get('socketio');

    console.log(`[Abelops Manual] Attempting to send message to ${phone_number}: "${message}" (Org: ${orgId || 'Default'})`);

    let messageId = `manual_offline_${Date.now()}`;
    let organization = null;

    if (orgId) {
        organization = await prisma.organization.findUnique({ where: { id: orgId } });
    }

    try {
        // Use Org credentials if available, otherwise fallback to ENV via sendMessage's internal logic
        const waResponse = await sendMessage(
            phone_number, 
            message, 
            organization?.whatsapp_phone_id, 
            organization?.whatsapp_token
        );
        
        if (waResponse && waResponse.messages && waResponse.messages[0]) {
            messageId = waResponse.messages[0].id;
            console.log(`[Abelops Manual] WhatsApp delivery successful.`);
        }
    } catch (err) {
        console.error('------------------------------------------------------------');
        console.error('[Abelops Manual] WHATSAPP API ERROR');
        console.error('[Abelops Manual] REASON:', err.message);
        console.error('[Abelops Manual] ACTION: Saving to local DB for Dashboard visibility.');
        console.error('------------------------------------------------------------');
    }

    try {
        // Always save to database for visibility
        const botMessage = await prisma.message.create({
            data: {
                phone_number,
                message,
                message_type: 'bot',
                message_id: messageId,
                timestamp: new Date(),
                organization_id: orgId || null
            }
        });

        // Notify dashboard (if user has it open)
        io.emit('new_message', {
            message: botMessage,
        });

        return res.status(200).json(botMessage);
    } catch (dbErr) {
        console.error('[Abelops Manual] DATABASE ERROR:', dbErr);
        return res.status(500).json({ error: 'Failed to record message in database' });
    }
};


module.exports = {
    getContacts,
    getMessages,
    sendManualMessage,
};
