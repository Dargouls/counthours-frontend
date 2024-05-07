import jwt_decode from 'jwt-decode';

export interface IPayloadTokens extends jwt_decode.JwtPayload {
	id: any;
	email: string;
	name: string;
}
