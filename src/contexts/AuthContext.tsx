import { createContext, useContext, useState } from 'react';

interface IAuthContext {
	showModal: boolean;
	toggleShow: Function;
}

export const LoginPage = createContext<IAuthContext>({ showModal: false, toggleShow: () => {} });
export const useLoginContext = () => useContext(LoginPage);

export const LoginProvider = ({ children }: any) => {
	const [showModal, setShowModal] = useState(false);

	const toggleShowModal = () => {
		setShowModal(!showModal);
	};
	return (
		<LoginPage.Provider value={{ showModal, toggleShow: toggleShowModal }}>
			{children}
		</LoginPage.Provider>
	);
};
