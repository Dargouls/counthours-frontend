import { createContext, useContext, useState } from 'react';

interface IAuthContext {
	showLogin: boolean;
	toggleShow: Function;
	toggleShowRegister: Function;
	showRegister: boolean;
}

export const LoginPage = createContext<IAuthContext>({
	showRegister: false,
	toggleShowRegister: () => {},
	showLogin: false,
	toggleShow: () => {},
});
export const useLoginContext = () => useContext(LoginPage);

export const LoginProvider = ({ children }: any) => {
	const [showLogin, setShowLogin] = useState(false);
	const [showRegister, setShowRegister] = useState(false);

	const toggleShowLogin = () => {
		setShowLogin(!showLogin);
	};

	const toggleShowRegister = () => {
		setShowRegister(!showRegister);
	};
	return (
		<LoginPage.Provider
			value={{ showRegister, toggleShowRegister, showLogin, toggleShow: toggleShowLogin }}
		>
			{children}
		</LoginPage.Provider>
	);
};
