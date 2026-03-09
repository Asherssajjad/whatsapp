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

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
    console.log('Socket user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Socket user disconnected');
    });
});

// Attach io to app for use in routes
app.set('socketio', io);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
