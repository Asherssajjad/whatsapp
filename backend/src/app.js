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
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Check Routes
app.get('/status', (req, res) => {
    res.send({ status: 'OK', message: 'Abelops Intelligence Backend is running.' });
});

// Use Routes
app.use('/webhook', webhookRoutes); // Keep at root for Meta compatibility
app.use('/api/auth', authRoutes);    // Move under /api/auth for frontend consistency
app.use('/api/admin', adminRoutes);
app.use('/api', chatRoutes);


module.exports = app;

