const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Standard Prisma 7 setup for long-running servers.
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

console.log('Native Prisma Client Initialized (Direct URL)');

module.exports = prisma;
