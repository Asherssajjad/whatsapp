const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  log: ['error', 'warn'],
  // Give Railway's internal network 20 seconds to resolve the hostname
  connectTimeout: 20000,
});

async function connectWithRetry(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      console.log('✅ Successfully connected to Database');
      return;
    } catch (err) {
      console.error(`❌ Connection attempt ${i + 1} failed:`, err.message);
      if (i === retries - 1) process.exit(1);
      // Wait 3 seconds before trying again
      await new Promise(res => setTimeout(res, 3000));
    }
  }
}

connectWithRetry();

module.exports = prisma;
