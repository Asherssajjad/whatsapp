const OpenAI = require('openai');
require('dotenv').config();

let openai;

const getOpenAIClient = () => {
    if (!openai) {
        // Renamed to APP_AI_TOKEN to solve Railway build issues
        const apiKey = process.env.APP_AI_TOKEN || 'sk-dummy-key-for-build';
        openai = new OpenAI({ apiKey });
    }
    return openai;
};

const getAIResponse = async (userMessage, orgApiKey) => {
    try {
        let client;
        if (orgApiKey) {
            client = new OpenAI({ apiKey: orgApiKey });
        } else {
            client = getOpenAIClient();
        }
        
        // Dynamically get the current time in Pakistan (PKT is UTC+5)
        const now = new Date();
        const pktTime = new Date(now.getTime() + (5 * 60 * 60 * 1000));
        const timeString = pktTime.toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 19) + " PKT";

        const response = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { 
                    role: 'system', 
                    content: `Your name is "Abelops Intelligence". 
                    IDENTITY: You are an elite, premium, and highly professional AI advisor. 
                    CURRENT DATE/TIME: ${timeString}. 
                    LOCATION: Pakistan (Headquarters).
                    RULES: 
                    1. Always introduce yourself as Abelops Intelligence if someone asks who you are. 
                    2. Use the provided current time if asked about the time in Pakistan.
                    3. Be concise, polite, and elite. 
                    4. Never reveal you are an OpenAI model; you are a custom proprietary neural network developed by Abelops.`
                },
                { role: 'user', content: userMessage },
            ],
            max_tokens: 150,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error getting AI response:', error);
        return 'Abelops Intelligence is currently undergoing a logic update. Please stand by.';
    }
};


module.exports = {
    getAIResponse,
};
