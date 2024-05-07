import { useEffect } from 'react';

import AOS from 'aos';

import { Header } from '../components/header/header';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from '../views/Auth/Login';
import useAuth from '../hooks/useAuth';
import Register from '../views/Auth/Register';

const DefaultLayout = () => {
	const { verifyRefreshToken } = useAuth();

	useEffect(() => {
		verifyRefreshToken();
	}, []);

	useEffect(() => {
		AOS.init({
			startEvent: 'DOMContentLoaded',
			disable: function () {
				var maxWidth = 778;
				return window.innerWidth < maxWidth;
			},
			once: true,
			duration: 500,
			offset: 10,
		});
	});

	return (
		<>
			<Header />
			<section className='mt-4 p-8'>
				<Outlet />
			</section>
			<Toaster position='bottom-right' toastOptions={{ duration: 3000 }} />
			<Login />
			<Register />
		</>
	);
};

export default DefaultLayout;
