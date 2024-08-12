const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const http = require('http');
const { Server } = require('ws');
require('dotenv').config();
const { Message, User } = require('./models');

const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// Ensure uploads directory exists 
const uploadDir = path.join(__dirname, 'uploads'); 
if (!fs.existsSync(uploadDir)) { 
    fs.mkdirSync(uploadDir); 
} 

app.use(cors(corsOptions));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
  
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
    });
  }

// Simple Route - Define the route here
app.get("/", (req, res) => {
    res.send("Welcome to the learning space.");
});

// WebSocket connections
let users = {};

wss.on('connection', (ws, req) => {
    ws.on('message', async (data) => {
        const messageData = JSON.parse(data);
        
        if (messageData.type === 'message') {
            // Save the message to the database
            const message = await Message.create({
                fromUserID: messageData.userID,
                toUserID: messageData.to,
                content: messageData.content
            });

            // Broadcast the message to the recipient
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN && client !== ws) {
                    client.send(JSON.stringify({
                        type: 'message',
                        from: messageData.userID,
                        to: messageData.to,
                        content: messageData.content
                    }));
                }
            });
        }
    });
});

async function handleMessage(parsedMessage) {
    const { userID, to, content } = parsedMessage;

    // Store the message in the database
    await storeMessage(userID, to, content);

    // Send the message to the recipient if they are connected
    const recipientWs = users[to];
    if (recipientWs) {
        recipientWs.send(JSON.stringify({
            from: userID,
            content,
            timestamp: new Date().toISOString()
        }));
    }
}

async function storeMessage(from, to, content) {
    try {
        await Message.create({
            fromUserID: from,
            toUserID: to,
            content,
            createdAt: new Date(),
        });
        console.log('Message stored in database');
    } catch (error) {
        console.error('Failed to store message:', error);
    }
}

// Routes
const challengeRoute = require('./routes/challenge');
app.use('/challenge', challengeRoute);

const forumRoute = require('./routes/forum');
app.use("/forum", forumRoute);

const userRoute = require('./routes/user');
app.use("/user", userRoute);

const adminRoute = require('./routes/admin');
app.use("/admin", adminRoute);

const authRoute = require('./routes/auth');
app.use("/auth", authRoute);

const communicationRoutes = require('./routes/communication');
app.use('/communication', communicationRoutes);

const eventRoute = require('./routes/event');
app.use("/event", eventRoute);

const eventEmailRoute = require('./routes/eventemail');
app.use("/eventemail", eventEmailRoute);

const eventpostRoute = require('./routes/eventpost');
app.use("/eventpost", eventpostRoute);

const rewardRoute = require('./routes/reward');
app.use("/reward", rewardRoute);

// Route to serve uploaded images
app.use('/uploads', express.static(uploadDir));

const chatbotRoute = require('./routes/chatbot');
app.use("/chatbot", chatbotRoute);

const userRewardRoute = require('./routes/userreward');
app.use("/userreward", userRewardRoute);

const homepageRoute = require('./routes/homepage');
app.use("/homepage", homepageRoute);

// Start server after synchronizing the DB files under models folder
const db = require('./models');

async function syncDatabase() {
    try {
        // Sync parent models first (e.g., Events)
        await db.Event.sync();

        // Sync child models that reference the parent models
        await db.EventEmail.sync();
        // Sync other models here...

        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Error synchronizing models:', error);
    }
}

syncDatabase()
    .then(() => {
        let port = process.env.APP_PORT || 3001;
        server.listen(port, () => {
            console.log(`⚡ Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
