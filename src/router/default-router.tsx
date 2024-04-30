import { DefaultLayout } from '../layout/default';
import Counter from '../views/Counter';
import { UserServices } from '../views/userServices';

export const DefaultRouter = [
	{
		path: '/',
		element: <DefaultLayout />,
		children: [
			{
				path: '/',
				element: <Counter />,
			},
			{
				path: '/services',
				element: <UserServices />,
			},
		],
	},
];
