const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL.split('?')[0],
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const res = await pool.query('SELECT id, email, role FROM "User"');
    console.log('--- USERS IN DATABASE ---');
    console.table(res.rows);
    
    const orgs = await pool.query('SELECT id, name, whatsapp_phone_id FROM "Organization"');
    console.log('\n--- ORGANIZATIONS IN DATABASE ---');
    console.table(orgs.rows);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

check();
