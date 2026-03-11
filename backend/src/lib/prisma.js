const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const rawUrl = process.env.DATABASE_URL || '';

// Auto-inject SSL for Railway public proxy if missing
let connectionUrl = rawUrl;
if (rawUrl.includes('rlwy.net') && !rawUrl.includes('sslmode')) {
  connectionUrl += (rawUrl.includes('?') ? '&' : '?') + 'sslmode=no-verify';
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: connectionUrl,
    },
  },
  log: ['error', 'warn'],
});

async function connectWithRetry(retries = 5) {
  if (!connectionUrl) {
    console.error('❌ ERROR: DATABASE_URL is not defined in environment variables!');
    return;
  }

  const maskedUrl = connectionUrl.replace(/:\/\/.*@/, '://****:****@');
  console.log(`📡 Connecting to: ${maskedUrl}`);

  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      console.log('✅ Successfully connected to Database');
      return;
    } catch (err) {
      console.error(`❌ Connection attempt ${i + 1} failed:`, err.message);
      if (i === retries - 1) process.exit(1);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

connectWithRetry();

module.exports = prisma;
