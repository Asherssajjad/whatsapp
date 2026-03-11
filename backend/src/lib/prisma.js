const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

console.log('Stable Prisma 6 Client Initialized');

module.exports = prisma;
