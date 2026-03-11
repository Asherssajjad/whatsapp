const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  log: ['error', 'warn'],
  connectTimeout: 20000,
});

async function connectWithRetry(retries = 5) {
  const rawUrl = process.env.DATABASE_URL || '';
  const maskedUrl = rawUrl.replace(/:\/\/.*@/, '://****:****@');
  
  console.log(`📡 Attempting to connect to: ${maskedUrl}`);

  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      console.log('✅ Successfully connected to Database');
      return;
    } catch (err) {
      console.error(`❌ Connection attempt ${i + 1} failed:`, err.message);
      if (i === retries - 1) {
        console.error('💡 TIP: If using internal URL, ensure the hostname (e.g. postgres.railway.internal) matches your Service Name exactly.');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 3000));
    }
  }
}

connectWithRetry();

module.exports = prisma;
