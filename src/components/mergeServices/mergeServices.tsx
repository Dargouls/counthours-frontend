import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { useMutation } from 'react-query';
import { api } from '../../api/api';
import toast from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

interface IModalProps {
	open: boolean;
	onClose: () => void;
	idsServices: GridRowSelectionModel;
}

const boxStyle = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
};
export const MergeServices = ({ open, onClose, idsServices }: IModalProps) => {
	const { register, handleSubmit, watch } = useForm();
	const mergeName = watch('merge-name');
	const { mutate: mergeServices, isLoading: isMerging } = useMutation(() => handleMergeServices(), {
		onMutate: () => {
			toast.success('Serviços juntados com sucesso!');
			onClose();
		},
		onError: (err: AxiosError) => {
			console.log(err);
			toast.error('Erro ao juntar os servicos');
		},
	});

	async function handleMergeServices() {
		try {
			const response = await api.post('/services/merge', {
				ids: idsServices.map((id) => Number(id)),
				name: mergeName || null,
				user_id: 1,
			});

			console.log(response?.data);
			return response?.data;
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
		>
			<Box sx={boxStyle}>
				<Typography id='modal-modal-title' variant='h6' component='h2'>
					Juntar os períodos
				</Typography>
				<Typography id='modal-modal-description' sx={{ mt: 2 }}>
					Você pode editar esta junção mais tarde, mas não separar os períodos.
				</Typography>
				<TextField
					id='merge-name'
					className='w-100 mt-2'
					variant='standard'
					label='Nome da junção (opcional)'
					{...register('merge-name')}
				/>
				<Box className='flex gap-2 mt-4'>
					<form onSubmit={handleSubmit(() => mergeServices())}></form>
					<Button variant='text' onClick={onClose}>
						Cancelar
					</Button>
					<LoadingButton variant='contained' loading={isMerging}>
						Juntar
					</LoadingButton>
				</Box>
			</Box>
		</Modal>
	);
};
