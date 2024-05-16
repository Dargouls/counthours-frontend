import { useMutation } from 'react-query';
import { api } from '../api/api';
import Cookies from 'js-cookie';
import * as jwt_decode from 'jwt-decode';
import toast from 'react-hot-toast';
import { ErrorResponse, getError } from '../utils/internalCodes';
import { AxiosError } from 'axios';
import { IPayloadTokens } from '../baseInterfaces/IPayloadTokens';

/**
 * @description `Ciclo para refresh:` chama a função verifyRefreshToken. Ela vai gerar um novo refreshToken ou logout caso o token esteja expirado.
 *
 */

interface ILogin {
	email: string;
	password: string;
}
interface ICreateAccount {
	name: string;
	email: string;
	password: string;
}

const useAuth = () => {
	const {
		mutate: login,
		isLoading: isLoadingLogin,
		isSuccess: isLogged,
		isError: isErrorLogin,
	} = useMutation('login', async ({ email, password }: any) => _login({ email, password }), {
		onError: (error: AxiosError<ErrorResponse>) => {
			console.log(error);
			toast.error(getError(error));
		},
	});
	const {
		mutate: createAccount,
		isLoading: isCreatingAccount,
		isSuccess: isCreated,
		isError: isErrorRegister,
	} = useMutation(
		'createAccount',
		async ({ name, email, password }: any) => _createAccount({ name, email, password }),
		{
			onError: (error: AxiosError<ErrorResponse>) => {
				console.log(error);
				toast.error(getError(error));
			},
		}
	);

	async function _login({ email, password }: ILogin) {
		if (!email || !password) return;
		const response = await api.post('/login', { email: email.toLowerCase().trim(), password });

		if (response?.data?.tokens?.accessToken || response?.data?.tokens?.refreshToken) {
			Cookies.set('counthours_access_token', response?.data.tokens.accessToken, {
				path: '/',
				// secure: true,
				sameSite: 'strict',
			});
			Cookies.set('counthours_refresh_token', response?.data.tokens.refreshToken, {
				path: '/',
				// secure: true,
				sameSite: 'strict',
			});
			window.location.reload();
		}
		return response?.data;
	}

	async function _createAccount({ name, email, password }: ICreateAccount) {
		if (!name || !email || !password) return;
		const response = await api.post('/create-account', {
			name: name.trim(),
			email: email.toLowerCase().trim(),
			password,
		});
		if (response?.data?.tokens?.accessToken || response?.data?.tokens?.refreshToken) {
			Cookies.set('counthours_access_token', response?.data.tokens.accessToken, {
				path: '/',
				// secure: true,
				sameSite: 'strict',
			});
			Cookies.set('counthours_refresh_token', response?.data.tokens.refreshToken, {
				path: '/',
				// secure: true,
				sameSite: 'strict',
			});
			window.location.reload();
		}
		return response?.data;
	}

	async function _logout() {
		Cookies.remove('counthours_access_token');
		Cookies.remove('counthours_refresh_token');

		window.location.href = '/';
	}

	function getAccessToken() {
		const accessToken = Cookies.get('counthours_access_token');
		// try {
		// 	const verifyToken = await api.post('/verify/tokens', { token: accessToken, refreshToken });
		// 	console.log(verifyToken);
		// } catch (error: any) {
		// 	console.log(error);
		// 	toast.error(getError(error));
		// }
		return accessToken;
	}

	function getUser() {
		const accessToken = Cookies.get('counthours_access_token');
		if (!accessToken) return;
		const user = jwt_decode.jwtDecode<IPayloadTokens>(accessToken || '');
		const userInfo = {
			id: user.id,
			email: user.email,
			name: user.name,
			refreshToken: getRefreshToken(),
		};
		return userInfo;
	}

	function getRefreshToken() {
		const refreshToken = Cookies.get('counthours_refresh_token');
		return refreshToken;
	}

	async function regenerateRefreshToken() {
		const refreshToken = Cookies.get('counthours_refresh_token');
		const user = getUser();
		if (!refreshToken || !user) return;

		try {
			const response = await api.post('/verify/get/refresh-token', getUser());
			Cookies.set('counthours_refresh_token', response?.data?.refreshToken, {
				path: '/',
				sameSite: 'strict',
			});
			if (response.status === 200) return true;
		} catch (error: any) {
			console.log(error);
			toast.error(getError(error));
			return false;
		}
	}

	function verifyRefreshToken() {
		const refreshToken = Cookies.get('counthours_refresh_token');
		if (refreshToken === 'undefined' || refreshToken === 'null') {
			_logout();
			toast.error('Sua sessão expirou, faça login novamente...');
			return false;
		}

		if (refreshToken) {
			const time = jwt_decode.jwtDecode(refreshToken);
			const isExpires = Number(time.exp) - Date.now() / 1000 > 0 ? true : false;

			if (isExpires) {
				const response = regenerateRefreshToken();
				if (!response) {
					_logout();
					return false;
				}
			}
		}
		return true;
	}
	function verifyExpiresAccessToken() {
		const accessToken = Cookies.get('counthours_access_token');
		if (!accessToken) return false;
		jwt_decode.jwtDecode(accessToken);
		return;
	}

	function verifyExpiresRefreshToken() {
		const refreshToken = Cookies.get('counthours_refresh_token');
		if (!refreshToken) return false;
		jwt_decode.jwtDecode(refreshToken);
		return true;
	}

	return {
		login,
		isLoadingLogin,
		isLogged,
		getAccessToken,
		getUser,
		verifyExpiresAccessToken,
		verifyExpiresRefreshToken,
		verifyRefreshToken,
		isErrorLogin,
		createAccount,
		isCreatingAccount,
		isErrorRegister,
		isCreated,
		_logout,
	};
};
export default useAuth;
