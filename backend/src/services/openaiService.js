const OpenAI = require('openai');
require('dotenv').config();

let openai;

const getOpenAIClient = () => {
    if (!openai) {
        openai = new OpenAI({
            apiKey: process.env['AI_SECRET_KEY'] || process.env['OPENAI_API_KEY'] || 'sk-dummy-key-for-build',
        });
    }
    return openai;
};

const getAIResponse = async (userMessage) => {
    try {
        const client = getOpenAIClient();
        const response = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful customer support AI for a business called "MyBusiness". Be polite and concise.' },
                { role: 'user', content: userMessage },
            ],
            max_tokens: 150,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error getting AI response:', error);
        return 'Sorry, I am having trouble processing your request right now.';
    }
};

module.exports = {
    getAIResponse,
};
