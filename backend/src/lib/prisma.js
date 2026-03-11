const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const rawUrl = process.env.DATABASE_URL || '';
const connectionString = rawUrl.split('?')[0];

console.log('PostgreSQL Configuration: Initializing Hybrid Handshake...');

const pool = new Pool({
  connectionString: connectionString,
  // Hybrid SSL: Required for Railway Public Proxy
  ssl: rawUrl.includes('rlwy.net') ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
});

// CRITICAL: Prevent ECONNRESET from crashing the app
pool.on('error', (err) => {
  if (err.message.includes('ECONNRESET')) {
    console.warn('⚠️ Pool Handshake Reset by Proxy - Retrying...');
  } else {
    console.error('Unexpected Pool Error:', err.message);
  }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function connectWithRetry(retries = 10) {
  if (!rawUrl) {
    console.error('❌ DATABASE_URL missing!');
    return;
  }
  
  const maskedUrl = connectionString.replace(/:\/\/.*@/, '://****:****@');
  console.log(`📡 JS Adapter: Connecting to Public Proxy: ${maskedUrl}`);

  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      const res = await client.query('SELECT NOW()');
      client.release();
      console.log('✅ DATABASE CONNECTED SUCCESSFULLY AT:', res.rows[0].now);
      return;
    } catch (err) {
      console.error(`❌ Attempt ${i + 1} failed: ${err.message}`);
      
      if (err.message.includes('ECONNRESET') || err.message.includes('Connection terminated')) {
        console.warn('💡 TIP: Check your Postgres service in Railway. If it has a warning triangle, it may be out of disk space or crashing.');
      }

      if (i === retries - 1) process.exit(1);
      // Faster retry for resets, longer for other errors
      const waitTime = err.message.includes('ECONNRESET') ? 2000 : 5000;
      await new Promise(res => setTimeout(res, waitTime));
    }
  }
}

connectWithRetry();

module.exports = prisma;
