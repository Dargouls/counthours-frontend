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
		onSettled: () => {
			onClose();
		},
		onSuccess: () => {
			toast.success('Serviços juntados com sucesso!');
		},
		onError: (err: AxiosError) => {
			console.log(err);
			toast.error('Erro ao juntar os servicos');
		},
	});

	async function handleMergeServices() {
		const response = await api.post('/services/merge', {
			ids: idsServices.map((id) => id),
			name: mergeName || null,
			user_id: 1,
		});
		return response?.data;
	}

	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
		>
			<Box sx={boxStyle}>
				<form onSubmit={handleSubmit(() => mergeServices())}>
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
						<Button variant='text' onClick={onClose}>
							Cancelar
						</Button>
						<LoadingButton type='submit' variant='contained' loading={isMerging}>
							Juntar
						</LoadingButton>
					</Box>
				</form>
			</Box>
		</Modal>
	);
};
