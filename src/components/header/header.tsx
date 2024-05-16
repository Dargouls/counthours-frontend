import {
	AppBar,
	Avatar,
	Box,
	Button,
	Container,
	IconButton,
	Link,
	Menu,
	MenuItem,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import logo from '../../assets/images/brand/clock.svg';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useLoginContext } from '../../contexts/AuthContext';

export const Header = () => {
	const { getUser, _logout } = useAuth();
	const navigate = useNavigate();
	const user = getUser();
	const { toggleShow, toggleShowRegister } = useLoginContext();
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};
	return (
		<AppBar position='relative'>
			<Container maxWidth='xl'>
				<Toolbar disableGutters>
					<Typography
						variant='h6'
						noWrap
						component='a'
						href='/'
						sx={{
							mr: 2,
							display: { xs: 'none', md: 'flex' },
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						<img src={logo} alt='logo do site' width={50} />
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size='large'
							aria-label='account of current user'
							aria-controls='menu-appbar'
							aria-haspopup='true'
							onClick={handleOpenNavMenu}
							color='inherit'
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id='menu-appbar'
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							<MenuItem onClick={handleCloseNavMenu}>
								<Link className='no-underline' onClick={() => navigate('/')} textAlign='center'>
									Início
								</Link>
							</MenuItem>
							{getUser() && (
								<MenuItem onClick={handleCloseNavMenu}>
									<Link
										className='no-underline'
										onClick={() => navigate('/services')}
										textAlign='center'
									>
										Períodos
									</Link>
								</MenuItem>
							)}
						</Menu>
					</Box>
					<Typography
						variant='h5'
						noWrap
						component='a'
						href='#'
						sx={{
							mr: 2,
							display: { xs: 'flex', md: 'none' },
							flexGrow: 1,
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					></Typography>
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						<Button onClick={() => navigate('/')} sx={{ my: 2, color: 'white', display: 'block' }}>
							Início
						</Button>
						{getUser() && (
							<Button
								onClick={() => navigate('/services')}
								sx={{ my: 2, color: 'white', display: 'block' }}
							>
								Períodos
							</Button>
						)}
					</Box>
					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title='Configurações'>
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar alt='foto-usuario' />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id='menu-appbar'
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{user ? (
								<Box>
									<MenuItem onClick={handleCloseUserMenu}>
										<Typography textAlign='center'>{user?.name}</Typography>
									</MenuItem>
									<MenuItem onClick={() => _logout()}>
										<Typography textAlign='center'>Sair da conta</Typography>
									</MenuItem>
								</Box>
							) : (
								<Box>
									<MenuItem onClick={() => toggleShow()}>
										<Typography textAlign='center'>Entrar na conta</Typography>
									</MenuItem>
									<MenuItem onClick={() => toggleShowRegister()}>
										<Typography textAlign='center'>Criar conta</Typography>
									</MenuItem>
								</Box>
							)}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
