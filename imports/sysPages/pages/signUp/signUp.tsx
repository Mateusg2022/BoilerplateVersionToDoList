// signup component similar to login page (except loginWithPassword)
// instead createUser to insert a new user account document

// login page overrides the form’s submit event and call Meteor’s loginWithPassword()
// Authentication errors modify the component’s state to be displayed
import React from 'react';
import { Link, NavigateFunction } from 'react-router-dom';
import Container from '@mui/material/Container';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import Button from '@mui/material/Button';
import { userprofileApi } from '../../../modules/userprofile/api/userProfileApi';
import SimpleForm from '/imports/ui/components/SimpleForm/SimpleForm';

import { useNavigate } from 'react-router-dom';

import { IUserProfile } from '/imports/modules/userprofile/api/userProfileSch';

import { sysFormPlaygroundSch } from '/imports/sysPages/pages/sysFormPlayground/interface/sysFormSch';
import { signUpSchema } from './signUpSch';
import { signUpStyle } from './signUpStyle';

import SysTextField from '../../../ui/components/sysFormFields/sysTextField/sysTextField';
import SysForm from '../../../ui/components/sysForm/sysForm';
import SysFormButton from '../../../ui/components/sysFormFields/sysFormButton/sysFormButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';

interface ISignUp {
	showNotification: (options?: Object) => void;
	navigate: NavigateFunction;
	user: IUserProfile;
}

export const SignUp = (props: ISignUp) => {
	const { showNotification } = props;

	const { Container, Content, FormContainer, FormWrapper } = signUpStyle;

	const navigate = useNavigate();
	const handleSubmit = (doc: { nome: string; email: string; password: string }) => {
		const { nome, email, password } = doc;

		userprofileApi.insertNewUser({ username: nome, email, password }, (err, r) => {
			if (err) {
				console.log('Login err', err);
				showNotification &&
					showNotification({
						type: 'warning',
						title: 'Problema na criação do usuário!',
						description: 'Erro ao fazer registro em nossa base de dados!'
					});
				navigate('/signin');
			} else {
				showNotification &&
					showNotification({
						type: 'success',
						title: 'Cadastrado com sucesso!',
						description: 'Registro de usuário realizado em nossa base de dados!'
					});
				navigate('/signin');
			}
		});
	};

	return (
		<>
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
							<Typography variant="h1" display={'inline-flex'} gap={1}>
								<Typography variant="inherit" color={(theme) => theme.palette.sysText?.tertiary}>
									{/* {'{'} */}
								</Typography>
								Criar Conta
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
							<Typography variant="h5">Cadastre-se no sistema</Typography>
							<SysForm schema={signUpSchema} onSubmit={handleSubmit} debugAlerts={false}>
								<FormWrapper>
									<SysTextField name="nome" label="Nome" fullWidth placeholder="Digite seu nome" />
									<SysTextField name="email" label="Email" fullWidth placeholder="Digite seu email" />
									<SysTextField
										label="Senha"
										fullWidth
										name="password"
										placeholder="Digite sua senha"
										type="password"
									/>
									<Box />
									<SysFormButton variant="contained" color="primary" endIcon={<SysIcon name={'arrowForward'} />}>
										Cadastrar
									</SysFormButton>
									<Button variant="outlined" color="primary" onClick={() => navigate('/')}>
										Login
									</Button>
								</FormWrapper>
							</SysForm>
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
		</>
		//</Container>
	);
};
