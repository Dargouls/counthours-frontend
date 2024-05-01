import {
	Backdrop,
	Box,
	Button,
	Checkbox,
	CircularProgress,
	LinearProgress,
	Paper,
	Typography,
} from '@mui/material';
import { Wrapper } from './style';

import {
	DataGrid,
	GridColDef,
	GridRenderCellParams,
	GridRowSelectionModel,
	GridSlots,
} from '@mui/x-data-grid';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { api } from '../../api/api';
import { useState } from 'react';
import { useFormattedValues } from '../../hooks/useFormattedValues';
import { MergeServices } from '../../components/mergeServices/mergeServices';
import { IMergedService } from '../../baseInterfaces/IMergedService';
import { AxiosError } from 'axios';

export const UserServices = () => {
	const { setValue } = useFormattedValues();
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

	async function getServices() {
		const response = await api.get('/services/all/1');
		console.log(response?.data);
		return response?.data.map((service: IMergedService) => {
			const duration = setValue(
				Math.floor(
					new Date(service?.end_date || 0).getTime() - new Date(service.start_date).getTime()
				),
				'hours'
			);
			return {
				...service,
				duration: service?.total_hours
					? service?.total_hours
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

	const columns: GridColDef[] = [
		{ field: 'name', headerName: 'Nome', width: 250 },
		{ field: 'duration', headerName: 'Duração', width: 100 },
		{
			field: 'start_date',
			headerName: 'Data de Início',
			width: 180,
			renderCell: (params) => new Date(params.value).toLocaleString(),
		},
		{
			field: 'end_date',
			headerName: 'Data de Fim',
			width: 180,
			renderCell: (params) =>
				new Date(params.value).getFullYear() < 1970
					? 'Inacabado'
					: new Date(params.value).toLocaleString(),
		},
		{
			field: 'is_merged',
			headerName: 'É mesclado',
			width: 180,
			renderCell: (params: GridRenderCellParams) => (
				<Checkbox color='success' checked={!!params.value} disabled />
			),
		},
	];

	return (
		<Wrapper data-aos='zoom-out-down'>
			<Button onClick={() => refetch()}>Limpar</Button>

			<section className='flex flex-col gap-2'>
				<Typography variant='h4'>Serviços</Typography>
				<Paper elevation={3}>
					<Box sx={{ minHeight: 200 }}>
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
									sortModel: [{ field: 'end_date', sort: 'desc' }],
								},
							}}
							pageSizeOptions={[5, 10]}
							checkboxSelection
							onRowSelectionModelChange={(newRowSelectionModel) => {
								setRowSelectionModel(newRowSelectionModel);
							}}
							rowSelectionModel={rowSelectionModel}
						/>

						<Button
							size='large'
							disabled={rowSelectionModel.length < 2}
							variant='contained'
							onClick={() => setShowMerge(true)}
						>
							<Typography>Juntar períodos</Typography>
						</Button>
					</Box>
				</Paper>
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
		</Wrapper>
	);
};
