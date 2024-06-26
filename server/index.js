const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to the learning space.");
});

// Routes -> Add routes based on DB created
const eventRoute = require('./routes/event');
app.use("/event", eventRoute);

const eventpostRoute = require('./routes/eventpost');
app.use("/eventpost", eventpostRoute);

const testRoute = require('./routes/test');
app.use("/test", testRoute);

const db = require('./models');
db.sequelize.sync({ alter: true })
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`⚡ Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });