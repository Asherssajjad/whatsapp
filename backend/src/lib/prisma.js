const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// Immediate connection test to debug Railway internal networking
prisma.$connect()
  .then(() => console.log('Successfully connected to Database'))
  .catch((err) => console.error('Initial Database Connection Error:', err.message));

module.exports = prisma;
