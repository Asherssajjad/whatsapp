const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const rawUrl = process.env.DATABASE_URL || '';

// Clear the URL of any manual params to avoid conflicts
const connectionString = rawUrl.split('?')[0];

const pool = new Pool({
  connectionString: connectionString,
  // Standard Railway Public SSL configuration
  ssl: rawUrl.includes('rlwy.net') ? { rejectUnauthorized: false } : false,
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
  
  const maskedUrl = connectionString.replace(/:\/\/.*@/, '://****:****@');
  console.log(`📡 Connecting to Public Proxy: ${maskedUrl}`);

  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log('✅ JS Adapter: Successfully reached Database via Proxy');
      return;
    } catch (err) {
      console.error(`❌ Attempt ${i + 1} failed (${err.code || 'No Code'}):`, err.message);
      if (i === retries - 1) {
        console.error('💡 TIP: Go to your Database Service -> Settings and ensure "Public Networking" is ENABLED.');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

connectWithRetry();

module.exports = prisma;
