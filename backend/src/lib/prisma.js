const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

let connectionString = process.env.DATABASE_URL;

// Ensure SSL for Railway Public URL if not already specified
if (connectionString && connectionString.includes('rlwy.net') && !connectionString.includes('sslmode')) {
    connectionString += (connectionString.includes('?') ? '&' : '?') + 'sslmode=no-verify';
}

const pool = new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

console.log('Prisma Client Initialized with PG Adapter');

module.exports = prisma;
