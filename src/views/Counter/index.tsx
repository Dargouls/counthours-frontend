import { Suspense, lazy, useEffect, useRef } from 'react';
import { AxiosError } from 'axios';
import { api } from '../../api/api';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { useFormattedValues } from '../../hooks/useFormattedValues';

import { Wrapper } from './style';

import { Alert, Collapse, TextField } from '@mui/material';
import { MagicMotion } from 'react-magic-motion';
const UserServicesList = lazy(() => import('../../components/userServicesList/userServicesList'));
// import { UserServicesList } from '../../components/userServicesList/userServicesList';
import { LoadingButton } from '@mui/lab';
import { TimerDate } from '../../components/timerDate/timerDate';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { useFinishService } from '../../hooks/useFinishService';

const Counter = () => {
	const { finishService, isFinishingService, serviceFinished } = useFinishService();
	const { setValue } = useFormattedValues();
	const queryClient = useQueryClient();
	const { register, handleSubmit, watch, reset } = useForm();
	const serviceName = watch('serviceName');
	const inputRef = useRef<HTMLInputElement>(null);

	const { data: service, isLoading: isLoadingService } = useQuery('service', async () =>
		getService()
	);
	const { mutate: initService, isLoading: isInitLoading } = useMutation({
		mutationKey: 'initService',
		mutationFn: async () => {
			const newService = {
				name: serviceName,
				user_id: 1,
				start_date: dayjs(),
				end_date: null,
			};
			const response = await api.post('/services', newService);
			return response;
		},
		onSuccess: (e) => {
			toast.success('Período iniciado!');
			queryClient.setQueryData('service', () => {
				return {
					id: e.data.service.id,
					name: serviceName,
					user_id: 1,
					start_date: dayjs(),
					end_date: null,
				};
			});
		},
		onError: (error: AxiosError) => {
			console.log(error);
			toast.error('Erro ao iniciar o período');
		},
	});

	async function getService() {
		try {
			const response = await api.get('/service/user/1');
			return response?.data;
		} catch (error) {
			toast.error('Não foi possível achar o último serviço');
		}
	}

	const handleStartDate = () => {
		reset({ serviceName: '' });
		initService();
	};
	const handleEndDate = () => {
		finishService(service?.id);
	};

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	return (
		<MagicMotion>
			<Wrapper data-aos='zoom-out-down' onSubmit={handleSubmit(handleStartDate)}>
				<div className='mb-4 w-100 flex flex-row justify-center'>
					<Collapse
						sx={{ width: '50%' }}
						in={service?.end_date || !service?.start_date ? true : false}
					>
						<TextField
							id='service-name'
							className='w-100'
							variant='filled'
							label='Nome da atividade (opcional)'
							inputRef={inputRef}
							{...register('serviceName')}
						/>
					</Collapse>
				</div>

				<section className='mb-4'>
					<Collapse in={!service?.end_date && service?.start_date ? true : false}>
						<TimerDate date={service?.start_date} isLoading={isLoadingService} />
					</Collapse>
				</section>

				<section className='mb-4'>
					{service?.end_date || !service?.start_date ? (
						<LoadingButton
							sx={{ padding: '2rem 6rem', fontSize: '1.5rem', minWidth: '40%' }}
							loading={isInitLoading}
							// loadingPosition='start'
							variant='contained'
							onKeyDown={handleStartDate}
							type='submit'
							onClick={() => handleStartDate()}
						>
							Iniciar período
						</LoadingButton>
					) : (
						<LoadingButton
							sx={{ padding: '2rem 6rem', fontSize: '1.5rem', minWidth: '40%' }}
							variant='contained'
							color='error'
							loading={isFinishingService}
							onClick={() => handleEndDate()}
						>
							Finalizar período
						</LoadingButton>
					)}
				</section>
				<Collapse in={!service?.end_date && service?.start_date ? true : false}>
					<Alert severity='info' className='mb-4'>
						Início do período:{service?.name && ` (${service?.name})`}:{' '}
						{service?.start_date && setValue(service?.start_date, { type: 'datetime' })}
					</Alert>
				</Collapse>

				<Suspense fallback={<div>Loading...</div>}>
					<UserServicesList key='exclude' doRefetch={serviceFinished} />
				</Suspense>
			</Wrapper>
		</MagicMotion>
	);
};

export default Counter;
