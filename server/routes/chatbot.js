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

// Define the document context that guides the AI's responses
const documentContext = `
Website Overview: 
Our website is a comprehensive platform designed to engage users with various activities, including challenges, events, forums, and a rewards system. We aim to foster a community where users can learn, share, and grow together.

Challenges: 
Our challenges section offers a wide range of activities tailored to different interests and skill levels. These include:
- Coding Challenges: Solve algorithmic problems, build projects, and improve your coding skills across multiple languages.
- Design Contests: Showcase your creativity by designing graphics, UI/UX mockups, and more.
- Writing Competitions: Participate in essay writing, creative storytelling, and technical writing challenges.
- Quiz Challenges: Test your knowledge across various subjects with timed quizzes.

Events: 
We regularly host events to keep the community engaged and learning. Our events include:
- Hackathons: Compete in team-based coding marathons to build innovative solutions.
- Webinars: Attend expert-led sessions on topics like technology, design, entrepreneurship, and more.
- Workshops: Participate in hands-on workshops to learn new skills and techniques.
- Meetups: Network with other users and experts through virtual and in-person meetups.

Forums: 
Our forums are a vibrant space for discussion and support. Here, users can:
- Ask Questions: Seek help from the community on coding, design, career advice, and more.
- Share Knowledge: Post tutorials, guides, and experiences to help others.
- Discussion Boards: Engage in discussions on various topics, including technology trends, best practices, and community news.

Rewards: 
Our platform features a rewards system to recognize and incentivize user participation. Users can earn points through activities such as completing challenges, attending events, and contributing to forums. Points can be redeemed for:
- Merchandise: Exclusive platform-branded merchandise like t-shirts, mugs, and more.
- Gift Cards: Redeem points for gift cards from popular retailers.
- Exclusive Content: Access premium tutorials, courses, and e-books.
- Special Badges: Earn badges to display on your profile, showcasing your achievements and participation.

Additional Features:
- User Profiles: Customize your profile, track your achievements, and connect with other users.
- Leaderboards: Compete with others and see how you rank on various challenge and event leaderboards.
- Notifications: Stay updated with the latest news, events, and activities through our notification system.
`;

// AI Chatbot interaction route
router.post("/:userID/ai-chatbot", async (req, res) => {
    try {
        const { message } = req.body;

        // Combine user message with document context
        const fullPrompt = `${documentContext}\n\nUser: ${message}\nBot:`;

        // Generate a response from OpenAI's GPT-3.5-turbo
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: fullPrompt }],
        });

        const aiResponse = response.data.choices[0].message.content;

        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Failed to process message:', error);
        res.status(500).json({ error: 'Failed to process message.' });
    }
});

module.exports = router;
