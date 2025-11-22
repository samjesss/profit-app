import axios from 'axios';

// Use Render backend URL directly in production, relative path for local dev
const baseURL = import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? 'https://profit-backend-sfyo.onrender.com/api' : '/api');

const api = axios.create({
    baseURL: baseURL,
});

export default api;
