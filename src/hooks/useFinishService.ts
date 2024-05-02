import { useMutation, useQueryClient } from 'react-query';
import { api } from '../api/api';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';

export const useFinishService = () => {
	const queryClient = useQueryClient();

	const {
		mutate: finishService,
		isLoading: isFinishingService,
		isSuccess: serviceFinished,
		isError: serviceFinishedError,
		variables: finishedServiceId,
	} = useMutation({
		mutationKey: 'finishService',
		mutationFn: async (id: string) => {
			const response = await api.patch(`/services/end/${id}`);
			return response;
		},
		onSuccess: () => {
			queryClient.setQueryData('service', (current: any) => {
				return { id: current.id };
			});

			toast.success('Período finalizado!');
		},
		onError: (error: AxiosError) => {
			console.log(error);
			toast.error('Erro ao fechar o período');
		},
	});

	return {
		finishService,
		isFinishingService,
		finishedServiceId,
		serviceFinished,
		serviceFinishedError,
	};
};
