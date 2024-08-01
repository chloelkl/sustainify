const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

// Initialize OpenAI API configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

// Create an instance of OpenAIApi
const openai = new OpenAIApi(configuration);

// AI Chatbot interaction route
router.post("/:userID/ai-chatbot", async (req, res) => {
    try {
        const { message } = req.body;

        // Generate a response from OpenAI's GPT-3.5-turbo
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
        });

        const aiResponse = response.data.choices[0].message.content;

        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Failed to process message:', error);
        res.status(500).json({ error: 'Failed to process message.' });
    }
});

module.exports = router;
