import axios from 'axios';

export const api = axios.create({
	baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:3001',
});
