const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
    console.error("MONGODB_URI is not defined in .env");
} else {
    mongoose.connect(mongoURI)
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.error('MongoDB Connection Error:', err));
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
