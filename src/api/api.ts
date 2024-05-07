import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { ErrorResponse } from '../utils/internalCodes';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { IPayloadTokens } from '../baseInterfaces/IPayloadTokens';

export const api = axios.create({
	baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:3001',
});

api.interceptors.request.use((request) => {
	const headers = request.headers ?? {};

	const token = Cookies.get('counthours_access_token');
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
			const refreshToken = Cookies.get('counthours_refresh_token');
			if (refreshToken) {
				const user = jwtDecode<IPayloadTokens>(refreshToken);
				try {
					const newToken = await api.post('/verify/get/access-token', {
						refreshToken,
						id: user.id,
						email: user.email,
						name: user.name,
					});
					Cookies.set('counthours_access_token', newToken.data.accessToken, {
						path: '/',
						sameSite: 'strict',
					});
					const originalRequest = error.config;
					if (originalRequest) {
						originalRequest.headers!['Authorization'] = `Bearer ${newToken}`;

						return await api(originalRequest);
					}
				} catch (error: any) {
					console.log(error);
					Cookies.remove('counthours_access_token');
					Cookies.remove('counthours_refresh_token');
					toast.error('Faça login novamente para continuar!');
				}
			}
		}
		return Promise.reject(error);
	}
);
