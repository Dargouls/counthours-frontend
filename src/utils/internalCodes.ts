import { AxiosError } from 'axios';

type IInternalCodes = Record<number, string>;

export const getError = (error: AxiosError<ErrorResponse>) =>
	internalCodes[error?.response?.data?.internalCode || 500];

export interface ErrorResponse {
	internalCode: number;
	message: string;
}

export const internalCodes: IInternalCodes = {
	500: 'Erro interno do servidor!',
	1000: 'Conta não encontrada!',
	1001: 'Usuário já existe!',
	1002: 'Email ou senha incorretos!',
	1003: 'Faça login para continuar!',
	1004: 'E-mail/senha incorretos!',
	1007: 'Sua conexão expirou, faça login novamente.',
};
