import { useMutation } from 'react-query';
import { api } from '../api/api';
import Cookies from 'js-cookie';
import * as jwt_decode from 'jwt-decode';
import toast from 'react-hot-toast';
import { ErrorResponse, getError } from '../utils/internalCodes';
import { AxiosError } from 'axios';
import { useLoginContext } from '../contexts/AuthContext';

interface IPayloadTokens extends jwt_decode.JwtPayload {
	id: any;
	email: string;
	name: string;
}

/**
 * @description `Ciclo para refresh:` chama a função verifyRefreshToken. Ela vai gerar um novo refreshToken ou logout caso o token esteja expirado.
 *
 */

const useAuth = () => {
	const { toggleShow } = useLoginContext();

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

	async function _login({ email, password }: any) {
		if (!email || !password) return;
		const response = await api.post('/login', { email, password });
		if (response?.data?.tokens?.accessToken || response?.data?.tokens?.refreshToken) {
			Cookies.set('access_token', response?.data.tokens.accessToken, {
				path: '/',
				// secure: true,
				sameSite: 'strict',
			});
			Cookies.set('refresh_token', response?.data.tokens.refreshToken, {
				path: '/',
				// secure: true,
				sameSite: 'strict',
			});
			toggleShow();
		}
		return response?.data;
	}

	async function _createAccount() {}

	async function _logout() {
		Cookies.remove('access_token');
		Cookies.remove('refresh_token');

		// window.location.href = '/';
	}

	function getAccessToken() {
		const accessToken = Cookies.get('access_token');
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
		const accessToken = Cookies.get('access_token');
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
		const refreshToken = Cookies.get('refresh_token');
		return refreshToken;
	}

	async function regenerateRefreshToken() {
		const refreshToken = Cookies.get('refresh_token');
		const user = getUser();
		if (!refreshToken || !user) return;

		try {
			const response = await api.post('/verify/get/refresh-token', getUser());
			Cookies.set('refresh_token', response?.data?.refreshToken, {
				path: '/',
				sameSite: 'strict',
			});
			return response;
		} catch (error: any) {
			console.log(error);
			toast.error(getError(error));
		}
	}

	function verifyRefreshToken() {
		const refreshToken = Cookies.get('refresh_token');
		if (refreshToken === 'undefined' || refreshToken === 'null') {
			_logout();
			console.log('refreshToken');
			toast.error('Sua sessão expirou, faça login novamente...');
			return;
		}

		if (refreshToken) {
			const time = jwt_decode.jwtDecode(refreshToken);
			const isExpires = Number(time.exp) - Date.now() / 1000 > 0 ? true : false;

			if (isExpires) {
				regenerateRefreshToken();
			}
			return true;
		}
	}
	function verifyExpiresAccessToken() {
		const accessToken = Cookies.get('access_token');
		if (!accessToken) return false;
		const verifyToken = jwt_decode.jwtDecode(accessToken);
		console.log(verifyToken);
		return;
	}

	function verifyExpiresRefreshToken() {
		const refreshToken = Cookies.get('refresh_token');
		if (!refreshToken) return false;
		const verifyToken = jwt_decode.jwtDecode(refreshToken);
		console.log(verifyToken);
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
		_createAccount,
		_logout,
	};
};
export default useAuth;
