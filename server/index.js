const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));

// Serve static files from the client folder
app.use(express.static(path.join(__dirname, '..', 'client')));

// Simple Route - Define the route here
app.get("/", (req, res) => {
    res.send("Welcome to the learning space.");
});

// Routes -> Add routes based on DB created

const challengeRoute = require('./routes/challenge');
app.use('/challenge', challengeRoute)

const forum = require('./routes/forum');
app.use('/user', forum); // Mount forumRoutes under /users

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

const eventpostRoute = require('./routes/eventpost');
app.use("/eventpost", eventpostRoute);

const forumRoute = require('./routes/forum');
app.use("/forum", forumRoute);

const rewardRoute = require('./routes/reward');
app.use("/reward", rewardRoute);


// Start server after synchronising the DB files under models folder
const db = require('./models');
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT || 3001;
        app.listen(port, () => {
            console.log(`⚡ Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
