import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://whatsapp-production-c833.up.railway.app/api',
});

// Add Interceptor for Auth and Org ID
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (user && user.organization_id) {
        config.headers['x-org-id'] = user.organization_id;
    }
    
    return config;
});


export const getContacts = () => api.get('/contacts');
export const getMessages = (phoneNumber) => api.get(`/messages/${phoneNumber}`);
export const sendManualMessage = (phoneNumber, message) =>
    api.post('/send', { phone_number: phoneNumber, message });

export default api;
