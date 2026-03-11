import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'https://whatsapp-production-c833.up.railway.app', {
    autoConnect: true,
});

export default socket;
