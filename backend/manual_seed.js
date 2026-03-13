const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL.split('?')[0],
  ssl: { rejectUnauthorized: false }
});

async function run() {
  console.log('--- STARTING MANUAL SEED ---');
  let client;
  try {
    client = await pool.connect();
    console.log('Connected to DB');

    const adminEmail = 'ashersajjad98@gmail.com';
    const adminPassword = 'AsherSajjad2026';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if table exists (case sensitive)
    const checkTable = await client.query("SELECT to_regclass('public.\"User\"')");
    if (!checkTable.rows[0].to_regclass) {
      console.error('Table "User" does not exist! Did you run prisma db push?');
      process.exit(1);
    }

    const existing = await client.query('SELECT * FROM "User" WHERE email = $1', [adminEmail]);
    
    if (existing.rows.length === 0) {
      await client.query(
        'INSERT INTO "User" (id, email, password, role, name, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
        [crypto.randomUUID ? crypto.randomUUID() : 'admin-uuid-' + Date.now(), adminEmail, hashedPassword, 'ADMIN', 'System Admin']
      );
      console.log('Admin user created successfully.');
    } else {
      await client.query('UPDATE "User" SET password = $1 WHERE email = $2', [hashedPassword, adminEmail]);
      console.log('Admin user already exists. Password updated to confirm.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Connection/Query Error:', err.message);
    if (err.message.includes('terminated')) {
        console.log('Retrying in 2 seconds...');
        setTimeout(run, 2000);
    } else {
        process.exit(1);
    }
  } finally {
    if (client) client.release();
  }
}

run();
