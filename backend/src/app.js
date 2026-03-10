const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Check for Database Configuration
if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not defined in .env");
} else {
    console.log('PostgreSQL Configuration Detected (Prisma)');
}

const webhookRoutes = require('./routes/webhookRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Check Routes
app.get('/status', (req, res) => {
    res.send({ status: 'OK', message: 'WhatsApp AI Dashboard Backend is running.' });
});

// Use Routes
app.use('/webhook', webhookRoutes);
app.use('/api', chatRoutes);

module.exports = app;
