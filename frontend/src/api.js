import axios from 'axios';

// Use environment variable for production, or relative path for local dev
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: baseURL,
});

export default api;
