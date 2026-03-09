import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

export const getContacts = () => api.get('/contacts');
export const getMessages = (phoneNumber) => api.get(`/messages/${phoneNumber}`);
export const sendManualMessage = (phoneNumber, message) =>
    api.post('/send', { phone_number: phoneNumber, message });

export default api;
