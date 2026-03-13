const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const adminEmail = 'ashersajjad98@gmail.com';
  const adminPassword = 'AsherSajjad2026';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
        password: hashedPassword,
        role: 'ADMIN'
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      name: 'System Admin'
    },
  });

  console.log('Admin user created/updated:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
