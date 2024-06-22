const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Serve static file from the client folder
app.use(express.static(path.join( '..', 'client')));

// Simple Route - Define the route here
app.get("/", (req, res) => {
    res.sendFile(path.join('..', 'client', 'index.html'));
    res.send("Sustainify Admin Side");
});

// app.get("/event", (req, res) => {
//     res.send("Event Admin Side");
// });

// app.get("/test", (req, res) => {
//     res.send("Test Admin Side");
// });

// Routes -> Add routes based on DB created
const eventRoute = require('./routes/event');
app.use("/event", eventRoute);

const testRoute = require('./routes/test');
app.use("/test", testRoute);

const forumRoute = require('./routes/forum');
app.use("/forum", forumRoute);

// Start server after synchronising the DB files under models folder
const db = require('./models');
db.sequelize.sync({ alter: false })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`⚡ Sever running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });