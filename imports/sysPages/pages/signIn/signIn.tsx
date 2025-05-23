import React, { useContext, useEffect } from 'react';
import SignInStyles from './signInStyles';
import { useNavigate } from 'react-router-dom';
import SysTextField from '../../../ui/components/sysFormFields/sysTextField/sysTextField';
import SysForm from '../../../ui/components/sysForm/sysForm';
import SysFormButton from '../../../ui/components/sysFormFields/sysFormButton/sysFormButton';
import { signInSchema } from './signinsch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';
import AuthContext, { IAuthContext } from '/imports/app/authProvider/authContext';
import AppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';

import AppsIcon from '@mui/icons-material/Apps';

const SignInPage: React.FC = () => {
	const { showNotification } = useContext(AppLayoutContext);
	const { user, signIn } = useContext<IAuthContext>(AuthContext);
	const navigate = useNavigate();
	const { Container, Content, FormContainer, FormWrapper } = SignInStyles;

	const handleSubmit = ({ email, password }: { email: string; password: string }) => {
		signIn(email, password, (err) => {
			if (!err || err == null) {
				navigate('/');
			} else {
				console.log('Login err', err);
				showNotification({
					type: 'error',
					title: 'Erro ao tentar logar',
					message: 'Email ou senha inválidos'
				});
			}
		});
	};

	const handleForgotPassword = () => navigate('/password-recovery');

	useEffect(() => {
		if (user) navigate('/');
	}, [user]);

	// <ScreenRouteRender component={SignUp} templateVariant="None" />;
	function handleSignUpClick() {
		return navigate('/sign-up');
	}

	return (
		<Container>
			<Content
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					flexDirection: 'row',
					gap: '2rem',
					padding: '2rem 0'
				}}>
				<div style={{ flex: 1 }}>
					<div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
						<Typography variant="h1" display={'inline-flex'} gap={1} sx={{ whiteSpace: 'nowrap' }}>
							<Typography variant="inherit" color={(theme) => theme.palette.sysText?.tertiary}>
								{/* {'{'} */}
							</Typography>
							To Do List App
							<Typography variant="inherit" color="sysText.tertiary">
								{/* {'}'} */}
							</Typography>
						</Typography>
						<img
							src="/images/wireframe/fav-icon-192.svg"
							alt="App Icon"
							style={{ marginLeft: 8, height: '50px' }}></img>
					</div>

					<FormContainer>
						<Typography variant="h5">Acesse o sistema</Typography>
						<SysForm schema={signInSchema} onSubmit={handleSubmit} debugAlerts={false}>
							<FormWrapper>
								<SysTextField name="email" label="Email" fullWidth placeholder="Digite seu email" />
								<SysTextField label="Senha" fullWidth name="password" placeholder="Digite sua senha" type="password" />
								<Button variant="text" sx={{ alignSelf: 'flex-end' }} onClick={handleForgotPassword}>
									<Typography variant="link">Esqueci minha senha</Typography>
								</Button>
								<Box />
								<SysFormButton variant="contained" color="primary" endIcon={<SysIcon name={'arrowForward'} />}>
									Entrar
								</SysFormButton>
							</FormWrapper>
						</SysForm>
						<Button
							variant="text"
							color="primary"
							onClick={handleSignUpClick} /*endIcon={<SysIcon name={'arrowForward'} />}*/
						>
							Criar conta
						</Button>
					</FormContainer>
				</div>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<img
						// src="/images/wireframe/fav-icon-192.svg"
						src="/images/wireframe/synergia-logo.svg"
						alt="App Icon"
						style={{ maxWidth: '100%', height: '200px', objectFit: 'contain' }}
					/>
				</div>
			</Content>
		</Container>
	);
};

export default SignInPage;
