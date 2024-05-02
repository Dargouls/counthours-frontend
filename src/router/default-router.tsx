import { lazy } from 'react';
const LazyPage = lazy(() => import('../layout/LazyPage'));

const UserServices = lazy(() => import('../views/userServices'));
const Counter = lazy(() => import('../views/Counter'));
const DefaultLayout = lazy(() => import('../layout/default'));

export const DefaultRouter = [
	{
		path: '/',
		element: <LazyPage page={<DefaultLayout />} />,
		children: [
			{
				path: '/',
				element: <LazyPage page={<Counter />} />,
			},
			{
				path: '/services',
				element: <LazyPage page={<UserServices />} />,
			},
		],
	},
];
