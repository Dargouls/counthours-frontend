import React, { useEffect } from 'react';

import AOS from 'aos';

import { Header } from '../components/header/header';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export const DefaultLayout = () => {
	useEffect(() => {
		AOS.init({
			startEvent: 'DOMContentLoaded',
			disable: function () {
				var maxWidth = 996;
				return window.innerWidth < maxWidth;
			},
			throttleDelay: 10,
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
		</>
	);
};
