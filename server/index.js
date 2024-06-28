const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Forum } = require('./models/Forum');

const app = express();
app.use(express.json());


// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Simple Route
app.get("/", (req, res) => {
    res.send("Sustainify Admin Side");
});

// Use forum routes
const forum = require('./routes/forum');
app.use('/user', forum); // Mount forumRoutes under /users

// Routes -> Add routes based on DB created
const eventRoute = require('./routes/event');
app.use("/event", eventRoute);

const testRoute = require('./routes/test');
app.use("/test", testRoute);

const forumRoute = require('./routes/forum');
app.use("/forum", forumRoute);

const db = require('./models');
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`⚡ Sever running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });