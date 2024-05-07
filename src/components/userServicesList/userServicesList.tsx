import { Card, CardContent, CardHeader, List, Skeleton, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { api } from '../../api/api';
import { IService } from '../../baseInterfaces/IService';
import { useFormattedValues } from '../../hooks/useFormattedValues';
import { Wrapper } from './style';
import { useEffect } from 'react';
import { MagicMotion } from 'react-magic-motion';
import dayjs from 'dayjs';
import { getError } from '../../utils/internalCodes';
import useAuth from '../../hooks/useAuth';

const UserServicesList = ({ doRefetch }: any) => {
	const { verifyExpiresRefreshToken, getUser } = useAuth();
	const { setValue } = useFormattedValues();
	const { data: services, isLoading, refetch } = useQuery('services', () => getServices());

	async function getServices() {
		if (!verifyExpiresRefreshToken()) return;
		try {
			const response = await api.get(`/services/all/${getUser()?.id}`);
			return Array.isArray(response?.data)
				? response?.data.sort((a, b) => dayjs(b.end_date).diff(dayjs(a.end_date)))
				: [];
		} catch (error: any) {
			console.log(error);
			toast.error(getError(error));
		}
	}

	useEffect(() => {
		refetch();
	}, [doRefetch]);

	return (
		<MagicMotion>
			<Wrapper className='mt-4'>
				<Typography variant='h5'>Últimos períodos</Typography>
				<List className='flex gap-2 justify-center' sx={{ height: 150 }}>
					{Array.isArray(services) &&
						services
							?.slice(0, 3)
							.map((service: IService) => {
								return (
									dayjs(service?.end_date || 0) > dayjs(service?.start_date) && (
										<Card key={service.id} className='w-48'>
											<CardHeader
												key={service.id}
												className='text-nowrap overflow-hidden'
												subheader={
													service.name || dayjs(service.end_date).format('DD/MM/YYYY, HH:mm')
												}
											/>
											<CardContent key={service.id}>
												<Typography variant='h4' className='flex justify-center' key={service.id}>
													{service.total_hours
														? setValue(service.total_hours, { type: 'hours' })
														: setValue(
																Math.floor(
																	dayjs(service?.end_date || 0).diff(dayjs(service.start_date))
																),
																{ type: 'hours' }
														  )}
												</Typography>
											</CardContent>
										</Card>
									)
								);
							})
							.reverse()}
					{isLoading &&
						Array.from({ length: 3 }).map((_, index) => (
							<Skeleton key={index} sx={{ height: 140 }} animation='wave' variant='rectangular' />
						))}
				</List>
			</Wrapper>
		</MagicMotion>
	);
};

export default UserServicesList;
