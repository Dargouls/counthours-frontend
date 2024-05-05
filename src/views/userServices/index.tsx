import {
	Alert,
	Backdrop,
	Box,
	Button,
	CircularProgress,
	LinearProgress,
	Paper,
	Popover,
	Typography,
} from '@mui/material';
import { Wrapper } from './style';

import {
	DataGrid,
	GridColDef,
	GridRenderCellParams,
	GridRowParams,
	GridRowSelectionModel,
	GridSlots,
} from '@mui/x-data-grid';
import toast from 'react-hot-toast';
import { useMutation, useQuery } from 'react-query';
import { api } from '../../api/api';
import { useEffect, useState } from 'react';
import { useFormattedValues } from '../../hooks/useFormattedValues';
import { MergeServices } from '../../components/mergeServices/mergeServices';
import { AxiosError } from 'axios';
import { IService } from '../../baseInterfaces/IService';
import dayjs from 'dayjs';
import { LoadingButton } from '@mui/lab';
import { Check, Trash2 } from 'lucide-react';
import { useFinishService } from '../../hooks/useFinishService';
import useAuth from '../../hooks/useAuth';

const messagesCodes = {
	4000: {
		message: 'Não é possível mesclar períodos inacabados.',
	},
	4001: {
		message: 'Não é possível mesclar páginas inacabadas.',
	},
};

const UserServices = () => {
	const { finishService, isFinishingService, finishedServiceId, serviceFinished } =
		useFinishService();
	const { getUser } = useAuth();
	const { setValue } = useFormattedValues();
	const [error, setError] = useState<string | null>();
	const [popErrorAnchor, setPopErrorAnchor] = useState<null | HTMLElement>(null);
	const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
	const [showMerge, setShowMerge] = useState(false);

	const {
		data: services,
		isLoading: isLoadingServices,
		refetch,
	} = useQuery('userServices', () => getServices(), {
		onError: (error: AxiosError) => {
			console.log(error);
			toast.error(serverErrors.search[error?.response?.status || '500']);
		},
	});

	const {
		mutate: deleteService,
		isLoading: isDeletingService,
		variables: serviceDeletedId,
	} = useMutation({
		mutationKey: 'deleteService',
		mutationFn: async (id: GridRowSelectionModel) => {
			const response = await api.delete(`/services/${id}`);
			return response;
		},
		onSuccess: () => {
			toast.success('Serviço excluído com sucesso');
			refetch();
		},
		onError: (error: AxiosError) => {
			console.log(error);
			toast.error(serverErrors.delete[error?.response?.status || 500]);
		},
	});

	async function getServices() {
		const response = await api.get(`/services/all/${getUser()?.id}`);
		return response?.data.map((service: IService) => {
			const duration = setValue(
				Math.floor(dayjs(service?.end_date || 0).diff(dayjs(service.start_date))),
				{ type: 'hours' }
			);

			return {
				...service,
				duration: service?.total_hours
					? setValue(service?.total_hours, { type: 'hours' })
					: Number(duration?.split('h')[0]) < 0
					? 'Inacabado'
					: duration || 0,
			};
		});
	}

	const handleSetMerged = () => {
		setShowMerge(false);
		setRowSelectionModel([]);
		refetch();
	};

	// const handleUpdateRow = (id: string) => {
	// 	if (!id || id === '') return;
	// 	apiRef.current.updateRows([{ id: id, end_date: dayjs().toISOString() }]);
	// };

	const handleShowMerge = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (rowSelectionModel.length < 2) {
			toast.error('Selecione ao menos dois períodos');
			return;
		}
		setPopErrorAnchor(event.currentTarget);

		for (const selectedId of rowSelectionModel) {
			const service = services.find((s: IService) => s.id === selectedId);

			if (!service?.end_date || dayjs(service.end_date).isBefore(service.start_date)) {
				setError(messagesCodes[4000].message);
				return;
			}
		}
		setShowMerge(true);
	};

	const handleDeleteServices = () => {
		deleteService(rowSelectionModel);
	};
	useEffect(() => {
		if (serviceFinished) refetch();
	}, [serviceFinished]);

	const columns: GridColDef[] = [
		{ field: 'name', type: 'string', headerName: 'Nome', width: 250 },
		{
			field: 'duration',
			type: 'string',
			headerName: 'Duração',
			width: 100,
		},
		{
			field: 'start_date',
			headerName: 'Data de Início',
			width: 180,
			renderCell: (params) => setValue(params.value, { type: 'datetime' }),
		},
		{
			field: 'end_date',
			headerName: 'Data de Fim',
			width: 180,
			renderCell: (params) =>
				dayjs(params.value) < dayjs(params.row.start_date) || !params.value
					? 'Inacabado'
					: setValue(params.value, { type: 'datetime' }),
		},
		{
			field: 'is_merged',
			type: 'boolean',
			headerName: 'É mesclado',
			renderCell: (params: GridRenderCellParams) =>
				!!params.row.is_principal && <Check color='#00ff8c' />,
		},
		{
			field: 'delete',
			width: 170,
			type: 'actions',
			getActions: (params: GridRowParams) => {
				const { id, start_date, end_date } = params.row;

				return [
					<>
						{dayjs(end_date) < dayjs(start_date) || !end_date ? (
							<LoadingButton
								key={id}
								variant='contained'
								size='small'
								loading={isFinishingService && finishedServiceId === id}
								onClick={() => finishService(id)}
							>
								Finalizar
							</LoadingButton>
						) : null}
					</>,
					<LoadingButton
						key={id}
						variant='contained'
						color='error'
						className='w-max min-w-max'
						size='small'
						loading={isDeletingService && serviceDeletedId === id}
						onClick={() => deleteService(id)}
					>
						<Trash2 size={16} />
					</LoadingButton>,
				];
			},
		},
	];

	return (
		<Wrapper data-aos='zoom-out-down'>
			<section className='flex flex-col gap-2'>
				<Typography variant='h4'>Serviços</Typography>
				<Box sx={{ minHeight: 200 }}>
					<Paper elevation={3}>
						<DataGrid
							autoHeight
							slots={{
								loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
							}}
							loading={isLoadingServices}
							rows={services || []}
							columns={columns}
							initialState={{
								pagination: {
									paginationModel: { page: 0, pageSize: 5 },
								},
								sorting: {
									sortModel: [{ field: 'start_date', sort: 'desc' }],
								},
							}}
							pageSizeOptions={[5, 10]}
							checkboxSelection
							onRowSelectionModelChange={(newRowSelectionModel) => {
								setRowSelectionModel(newRowSelectionModel);
							}}
							rowSelectionModel={rowSelectionModel}
						/>
					</Paper>

					<Box className='flex flex-row gap-2 mt-2'>
						<Button
							size='medium'
							disabled={rowSelectionModel.length < 2}
							variant='contained'
							onClick={(e) => handleShowMerge(e)}
						>
							<Typography>Mesclar períodos</Typography>
						</Button>

						<Button
							size='medium'
							disabled={rowSelectionModel.length < 2}
							variant='contained'
							onClick={() => handleDeleteServices()}
						>
							<Typography>Apagar selecionados</Typography>
						</Button>
					</Box>
				</Box>
			</section>

			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={isLoadingServices}
			>
				<CircularProgress color='inherit' />
			</Backdrop>

			<MergeServices
				idsServices={rowSelectionModel}
				open={showMerge}
				onClose={() => handleSetMerged()}
			/>
			<Popover
				open={!!error}
				anchorEl={popErrorAnchor}
				onClose={() => setError(null)}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				<Alert severity='warning' sx={{ p: 2 }}>
					{error}
				</Alert>
			</Popover>
		</Wrapper>
	);
};

export default UserServices;
