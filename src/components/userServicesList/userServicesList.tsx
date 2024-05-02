import { Card, CardContent, CardHeader, ImageList, Skeleton, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { api } from '../../api/api';
import { IService } from '../../baseInterfaces/IService';
import { useFormattedValues } from '../../hooks/useFormattedValues';
import { Wrapper } from './style';
import { useEffect } from 'react';
import { MagicMotion } from 'react-magic-motion';
import dayjs from 'dayjs';

export const UserServicesList = ({ doRefetch }: any) => {
	const { setValue } = useFormattedValues();

	const { data: services, isLoading, refetch } = useQuery('services', () => getServices());
	async function getServices() {
		try {
			const response = await api.get('/services/all/1');

			return response?.data;
		} catch (error) {
			console.log(error);
			toast.error('Erro ao carregar serviços');
		}
	}

	useEffect(() => {
		refetch();
	}, [doRefetch]);

	return (
		<MagicMotion>
			<Wrapper>
				<h1 className='mb-4'>Últimos períodos</h1>

				<ImageList sx={{ width: 700, height: 150 }} cols={3} rowHeight={150}>
					{Array.isArray(services) &&
						services?.slice(0, 3).map((service: IService) => {
							return (
								dayjs(service?.end_date || 0) > dayjs(service?.start_date) && (
									<Card>
										<CardHeader
											subheader={
												service.name || dayjs(service.start_date).format('DD/MM/YYYY, HH:mm')
											}
										/>
										<CardContent>
											<Typography variant='h4' className='flex justify-center'>
												{setValue(
													Math.floor(dayjs(service?.end_date || 0).diff(dayjs(service.start_date))),
													{ type: 'hours' }
												)}
											</Typography>
										</CardContent>
									</Card>
								)
							);
						})}
					{isLoading &&
						Array.from({ length: 3 }).map((_) => (
							<Skeleton sx={{ height: 140 }} animation='wave' variant='rectangular' />
						))}
				</ImageList>
			</Wrapper>
		</MagicMotion>
	);
};
