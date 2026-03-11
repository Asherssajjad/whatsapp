const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const rawUrl = process.env.DATABASE_URL || '';

// Robust URL formatting for Railway Public Proxy
let connectionUrl = rawUrl;
if (!connectionUrl.includes('sslmode')) {
  connectionUrl += (connectionUrl.includes('?') ? '&' : '?') + 'sslmode=no-verify';
}
if (!connectionUrl.includes('connect_timeout')) {
  connectionUrl += '&connect_timeout=30';
}

const pool = new Pool({
  connectionString: connectionUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function connectWithRetry(retries = 5) {
  if (!rawUrl) {
    console.error('❌ DATABASE_URL missing!');
    return;
  }
  
  const maskedUrl = connectionUrl.replace(/:\/\/.*@/, '://****:****@');
  console.log(`📡 JS Adapter connecting to: ${maskedUrl}`);

  for (let i = 0; i < retries; i++) {
    try {
      // With the adapter, we can check the pool connection directly
      await pool.query('SELECT 1');
      console.log('✅ JS Adapter: Successfully reached Database via Proxy');
      return;
    } catch (err) {
      console.error(`❌ Attempt ${i + 1} failed:`, err.message);
      if (i === retries - 1) process.exit(1);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

connectWithRetry();

module.exports = prisma;
