/*!

 =========================================================
 * Material Dashboard React - v1.0.0 based on Material Dashboard - v1.2.0
 =========================================================

 * Product Page: http://www.creative-tim.com/product/material-dashboard-react
 * Copyright 2018 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */
import React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { sysSizing } from '../../../ui/materialui/styles';

interface ISignUpStyles {
	Container: React.ElementType;
	Content: React.ElementType;
	FormContainer: React.ElementType;
	FormWrapper: React.ElementType;
}

export const signUpStyle = {
	containerSignUp: {
		width: '100%',
		maxWidth: 400
	},
	labelRegisterSystem: {
		textAlign: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	imageLogo: {
		maxWidth: 100
	},
	containerButtonOptions: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	containerRouterSignIn: {
		color: '#444'
	},
	Container: styled(Box)(({ theme }) => ({
		minHeight: '100vh',
		width: '100%',
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		position: 'relative',

		[theme.breakpoints.up('md')]: {
			// backgroundImage: 'url(/images/wireframe/background-synergia.svg)',
			backgroundSize: 'cover',
			backgroundPosition: 'right'
		}
	})),
	Content: styled(Box)(({ theme }) => ({
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		gap: theme.spacing(6),
		padding: `${sysSizing.spacingFixedLg} ${sysSizing.spacingFixedXl}`,

		[theme.breakpoints.up('md')]: {
			width: 'auto',
			height: 'auto',
			position: 'absolute',
			top: '50%',
			left: '10%',
			transform: 'translateY(-50%)'
		}
	})),
	FormContainer: styled(Paper)(({ theme }) => ({
		width: '100%',
		padding: `${sysSizing.spacingFixedLg} ${sysSizing.spacingFixedXl}`,
		borderRadius: sysSizing.radiusLg,
		boxShadow: theme.shadows[3],
		gap: sysSizing.spacingFixedXl,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		maxWidth: '400px'
	})),
	FormWrapper: styled(Box)(({ theme }) => ({
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		gap: theme.spacing(2)
	}))
};
