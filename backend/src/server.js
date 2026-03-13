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

const seedAdmin = async () => {
    try {
        const adminEmail = 'ashersajjad98@gmail.com';
        const adminPassword = 'AsherSajjad2026';
        
        const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
        
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'ADMIN',
                    name: 'System Admin'
                }
            });
            console.log(`[Seed] Admin user ${adminEmail} created.`);
        } else {
            console.log(`[Seed] Admin user ${adminEmail} already exists.`);
        }
    } catch (err) {
        console.error('[Seed] Error seeding admin:', err);
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
    await seedAdmin();
});

