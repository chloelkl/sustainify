const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Serve static files from the client folder
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// API Routes
const eventRoute = require('./routes/event');
app.use("/event", eventRoute);

const testRoute = require('./routes/test');
app.use("/test", testRoute);

const userRoute = require('./routes/user');
app.use("/user", userRoute);

const adminRoute = require('./routes/admin');
app.use("/admin", adminRoute);

const authRoute = require('./routes/auth');
app.use("/auth", authRoute);

// Serve React app for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// Start server after synchronising the DB files under models folder
const db = require('./models');
db.sequelize.sync({ alter: false })
    .then(() => {
        let port = process.env.APP_PORT || 3000;
        app.listen(port, () => {
            console.log(`⚡ Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
