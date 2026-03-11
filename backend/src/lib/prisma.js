const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const rawUrl = process.env.DATABASE_URL || '';

// If using a public URL (rlwy.net) from another project, it MUST have sslmode=no-verify
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
  const maskedUrl = connectionUrl.replace(/:\/\/.*@/, '://****:****@');
  console.log(`📡 Attempting cross-project connection to: ${maskedUrl}`);

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
