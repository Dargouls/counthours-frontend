import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	FormControl,
	Modal,
	TextField,
} from '@mui/material';

import useAuth from '../../../hooks/useAuth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useLoginContext } from '../../../contexts/AuthContext';

const Register = () => {
	const { toggleShowRegister, showRegister } = useLoginContext();
	const { createAccount, isCreatingAccount } = useAuth();
	const { register, watch, handleSubmit } = useForm();
	const [subPage, setSubPage] = useState(1);

	const name = watch('userName');
	const email = watch('userEmail');
	const password = watch('userPassword');

	const handleRegister = () => {
		createAccount({ name, email, password });
	};

	return (
		<Modal open={showRegister} className='flex justify-center items-center'>
			<Card title='Faça login para continuar'>
				<CardHeader title='Login' subheader='Isso demora menos de meio minuto :D' />
				<CardContent>
					{subPage === 1 && (
						<Box className='flex gap-2'>
							<Button type='button' variant='text' onClick={() => toggleShowRegister()}>
								Cancelar
							</Button>
							<Button type='button' variant='contained' onClick={() => setSubPage(2)}>
								Criar uma conta
							</Button>
						</Box>
					)}
					{subPage === 2 && (
						<Box className='flex gap-2'>
							<form className='flex w-full flex-col gap-2' onSubmit={handleSubmit(handleRegister)}>
								<FormControl required className='flex flex-col gap-1'>
									<TextField
										id='name'
										variant='outlined'
										label='Digite o seu nome'
										// inputRef={inputRef}
										{...register('userName')}
									/>
								</FormControl>
								<FormControl required className='flex flex-col mt-4 gap-1'>
									<TextField
										id='email'
										variant='outlined'
										label='Digite o seu email'
										// inputRef={inputRef}
										{...register('userEmail')}
									/>
								</FormControl>

								<FormControl required className='flex flex-col mt-4 gap-1'>
									<TextField
										id='password'
										variant='outlined'
										type='password'
										label='Digite sua senha'
										// inputRef={inputRef}
										{...register('userPassword')}
									/>
								</FormControl>
								<Box className='flex justify-between mt-2 gap-2'>
									<Button variant='text' onClick={() => setSubPage(1)}>
										Voltar
									</Button>
									<LoadingButton loading={isCreatingAccount} type='submit' variant='contained'>
										Criar
									</LoadingButton>
								</Box>
							</form>
						</Box>
					)}
				</CardContent>
			</Card>
		</Modal>
	);
};

export default Register;
