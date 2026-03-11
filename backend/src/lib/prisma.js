const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

// Deep SSL Config for Railway (Auto-detects if SSL is needed)
const isExternal = connectionString && connectionString.includes('rlwy.net');

const pool = new Pool({
    connectionString,
    ssl: isExternal ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

console.log(`Prisma 7 initialized with ${isExternal ? 'External (SSL)' : 'Internal'} connection.`);

module.exports = prisma;
