import { Badge, Box, Button, Checkbox, LinearProgress, Paper, Typography } from '@mui/material';
import { Wrapper } from './style';

import {
	DataGrid,
	GridColDef,
	GridRenderCellParams,
	GridRowSelectionModel,
	GridSlots,
} from '@mui/x-data-grid';
import toast from 'react-hot-toast';
import { useMutation, useQuery } from 'react-query';
import { api } from '../../api/api';
import { useEffect, useState } from 'react';
import { useFormattedValues } from '../../hooks/useFormattedValues';
import { IService } from '../../baseInterfaces/IService';
import { MergeServices } from '../../components/mergeServices/mergeServices';
import { IMergedService } from '../../baseInterfaces/IMergedService';
export const UserServices = () => {
	const { setValue } = useFormattedValues();
	const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
	const [showMerge, setShowMerge] = useState(false);

	const {
		data: services,
		isLoading: isLoadingServices,
		refetch: refetchServices,
	} = useQuery('userServices', () => getServices());

	async function getServices() {
		try {
			const response = await api.get('/services/all/1');

			return response?.data.map((service: IMergedService) => {
				const duration = setValue(
					Math.floor(
						new Date(service?.end_date || 0).getTime() - new Date(service.start_date).getTime()
					),
					'hours'
				);
				return {
					...service,
					start_date: new Date(service?.start_date).toLocaleString(),
					end_date: new Date(service?.end_date || service?.start_date).toLocaleString(),
					duration: service?.total_hours
						? service?.total_hours
						: Number(duration?.split('h')[0]) < 0
						? 'Inacabado'
						: duration || 0,
				};
			});
		} catch (error) {
			toast.error('Erro ao carregar serviços');
		}
	}

	const columns: GridColDef[] = [
		{ field: 'name', headerName: 'Nome', width: 250 },
		{ field: 'duration', headerName: 'Duração', width: 100 },
		{ field: 'start_date', headerName: 'Data de Início', width: 180 },
		{ field: 'end_date', headerName: 'Data de Fim', width: 180 },
		{
			field: 'is_merged',
			headerName: 'Junção',
			width: 180,
			renderCell: (params: GridRenderCellParams) => (
				<Checkbox color='success' checked={!!params.value} disabled />
			),
		},
	];

	return (
		<Wrapper data-aos='zoom-out-down'>
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

			<MergeServices
				idsServices={rowSelectionModel}
				open={showMerge}
				onClose={() => setShowMerge(false)}
			/>
		</Wrapper>
	);
};
