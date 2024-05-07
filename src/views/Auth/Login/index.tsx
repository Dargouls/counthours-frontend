import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	FormControl,
	Link,
	Modal,
	TextField,
} from '@mui/material';

import useAuth from '../../../hooks/useAuth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useLoginContext } from '../../../contexts/AuthContext';

const Login = () => {
	const { toggleShow, showLogin } = useLoginContext();
	const { login, isLoadingLogin } = useAuth();
	const { register, watch, handleSubmit } = useForm();
	const [subPage, setSubPage] = useState(1);

	const email = watch('userEmail');
	const password = watch('userPassword');

	const handleLogin = () => {
		login({ email, password });
	};

	return (
		<Modal open={showLogin} className='flex justify-center items-center'>
			<Card title='Faça login para continuar'>
				<CardHeader title='Login' subheader='Se não tiver uma conta, clique aqui para criar uma.' />
				<CardContent>
					{subPage === 1 && (
						<Box className='flex gap-2'>
							<Button type='button' variant='text' onClick={() => toggleShow()}>
								Cancelar
							</Button>
							<Button type='button' variant='contained' onClick={() => setSubPage(2)}>
								Fazer login
							</Button>
						</Box>
					)}
					{subPage === 2 && (
						<Box className='flex gap-2'>
							<form className='flex w-full flex-col gap-2' onSubmit={handleSubmit(handleLogin)}>
								<FormControl required className='flex flex-col gap-1'>
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
								<Link href='/register' className=''>
									Esqueceu sua senha?
								</Link>
								<Box className='flex justify-between mt-2 gap-2'>
									<Button variant='text' onClick={() => setSubPage(1)}>
										Voltar
									</Button>
									<LoadingButton loading={isLoadingLogin} type='submit' variant='contained'>
										Entrar
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

export default Login;
