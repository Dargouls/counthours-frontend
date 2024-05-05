import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { ErrorResponse } from '../utils/internalCodes';
import toast from 'react-hot-toast';

export const api = axios.create({
	baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:3001',
});

api.interceptors.request.use((request) => {
	const headers = request.headers ?? {};

	const token = Cookies.get('access_token');
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	request.headers = headers;
	return request;
});

api.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error: AxiosError<ErrorResponse>) => {
		if (error.response?.data.internalCode === 1007 || error.response?.data.internalCode === 1003) {
			const refreshToken = Cookies.get('refresh_token');

			if (refreshToken) {
				try {
					const newToken = await api.post('/verify/get/access-token', { refreshToken });
					Cookies.set('access_token', newToken.data.accessToken, { path: '/', sameSite: 'strict' });
					const originalRequest = error.config;
					if (originalRequest) {
						originalRequest.headers!['Authorization'] = `Bearer ${newToken}`;

						const originalResponse = await api(originalRequest);
					}
				} catch (error: any) {
					Cookies.remove('access_token');
					Cookies.remove('refresh_token');
					// window.location.href = '/';
					toast.error('Faça login novamente para continuar!');
				}
			} else {
				return Promise.reject(error);
				// toast.error('Faça login novamente para continuar!');
			}
		}
	}
);
