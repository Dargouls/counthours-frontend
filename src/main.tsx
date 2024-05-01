import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
//style
// import './index.css';
//interfaces
import { IRoute } from './baseInterfaces/IRoute.tsx';
//components
import App from './App.tsx';
import { DefaultRouter } from './router/default-router.tsx';
import { darkTheme } from './layout/themes/darkmode.ts';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.locale('de');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Sao_Paulo');
console.log(dayjs());
const router = createBrowserRouter([...DefaultRouter.map((route: IRoute) => route)], {
	basename: import.meta.env.BASE_URL,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<QueryClientProvider
				client={
					new QueryClient({
						defaultOptions: {
							queries: { staleTime: 10000, refetchOnWindowFocus: false },
							mutations: { retry: 1 },
						},
					})
				}
			>
				<App>
					<RouterProvider router={router} />
				</App>
			</QueryClientProvider>
		</ThemeProvider>
	</React.StrictMode>
);
