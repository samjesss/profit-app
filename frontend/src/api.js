import axios from 'axios';

// Determine base URL
let baseURL = import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? 'https://profit-backend-sfyo.onrender.com/api' : '/api');

// Ensure baseURL ends with /api if it's not just /api
if (baseURL !== '/api' && !baseURL.endsWith('/api')) {
    // Remove trailing slash if present before appending /api
    baseURL = baseURL.replace(/\/$/, '') + '/api';
}

const api = axios.create({
    baseURL: baseURL,
});

export default api;
