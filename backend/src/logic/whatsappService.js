const axios = require('axios');
require('dotenv').config();

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const API_VERSION = 'v21.0';

const sendMessage = async (to, messageText) => {
    const url = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;

    try {
        const response = await axios.post(
            url,
            {
                messaging_product: 'whatsapp',
                to: String(to), // Ensure to is a string
                type: 'text',
                text: { body: messageText },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('------------------------------------------------------------');
            console.error('[Abelops WhatsApp] Meta API Detailed Error:');
            console.error(JSON.stringify(error.response.data, null, 2));
            console.error('------------------------------------------------------------');
        } else {
            console.error('[Abelops WhatsApp] Error:', error.message);
        }
        throw error; // Re-throw to be caught by the controller
    }
};

module.exports = {
    sendMessage,
};
