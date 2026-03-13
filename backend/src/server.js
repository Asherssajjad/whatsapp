const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // For development, allow all. Update for production.
        methods: ['GET', 'POST'],
    },
});

const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');

const seedSystem = async () => {
    try {
        await prisma.$connect();
        console.log('[System] Verifying Infrastructure...');

        // 1. Seed Admin
        const adminEmail = 'ashersajjad98@gmail.com';
        const adminPassword = 'AsherSajjad2026';
        
        let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
        
        if (!admin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            admin = await prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'ADMIN',
                    name: 'System Admin'
                }
            });
            console.log(`[Seed] Admin user ${adminEmail} created.`);
        }

        // 2. Seed Primary Organization (from ENV)
        const primaryPhoneId = process.env.PHONE_NUMBER_ID?.trim();
        if (primaryPhoneId) {
            let org = await prisma.organization.findUnique({ where: { whatsapp_phone_id: primaryPhoneId } });
            if (!org) {
                org = await prisma.organization.create({
                    data: {
                        name: 'Primary Bot',
                        whatsapp_phone_id: primaryPhoneId,
                        whatsapp_token: process.env.ACCESS_TOKEN || '',
                        openai_token: process.env.APP_AI_TOKEN || '',
                        whatsapp_verify_token: process.env.VERIFY_TOKEN || 'abelops_verify',
                        message_limit: 5000
                    }
                });
                console.log(`[Seed] Primary Organization created for ID: ${primaryPhoneId}`);
            }

            // Bind admin to this org if not bound
            if (!admin.organization_id) {
                await prisma.user.update({
                    where: { id: admin.id },
                    data: { organization_id: org.id }
                });
            }
        }
    } catch (err) {
        console.error('[Seed] Critical Error during infrastructure check:', err.message);
    }
};


const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
    console.log('Socket user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Socket user disconnected');
    });
});

// Attach io to app for use in routes
app.set('socketio', io);

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    // Small delay to allow Prisma adapter to stabilize
    setTimeout(async () => {
        await seedSystem();
    }, 2000);
});

