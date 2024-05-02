import { ReactNode, Suspense } from 'react';
import Lottie from 'react-lottie-player';
import * as loading from '../assets/animations/loading-page.json';

interface ILazyPage {
	page: ReactNode;
}
const LazyPage = ({ page }: ILazyPage) => {
	return (
		<Suspense
			fallback={
				<div className='h-screen flex justify-center items-center w-full'>
					<Lottie loop play animationData={loading} className='w-96' />
				</div>
			}
		>
			{page}
		</Suspense>
	);
};

export default LazyPage;
