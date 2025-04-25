import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { SysFab } from '/imports/ui/components/sysFab/sysFab';
import { ToDosListControllerContext } from './toDosListController';
import { useNavigate } from 'react-router-dom';
import { ComplexTable } from '/imports/ui/components/ComplexTable/ComplexTable';
import DeleteDialog from '/imports/ui/appComponents/showDialog/custom/deleteDialog/deleteDialog';
// import { SysAppLayoutContext } from '/imports/app/appLayout';
import ToDosListStyles from './toDosListStyles';
import SysTextField from '/imports/ui/components/sysFormFields/sysTextField/sysTextField';
import { SysSelectField } from '/imports/ui/components/sysFormFields/sysSelectField/sysSelectField';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

import { DataGrid, GridColDef } from '@mui/x-data-grid';

// import { ToDosModuleContext } from '../../toDosContainer';
import AuthContext, { IAuthContext } from '/imports/app/authProvider/authContext';

const ToDosListView = () => {
	const controller = React.useContext(ToDosListControllerContext);
	// const { Container, LoadingContainer, SearchContainer } = ExampleListStyles;
	// const sysLayoutContextt = React.useContext(SysAppLayoutContext);
	const sysLayoutContext = React.useContext<IAppLayoutContext>(AppLayoutContext);
	const navigate = useNavigate();
	const { Container, LoadingContainer, SearchContainer } = ToDosListStyles;

	const authContext = React.useContext<IAuthContext>(AuthContext);

	// interface IAuthContext {
	// 		isLoggedIn: boolean;
	// 		user?: IUserProfile;
	// 		userLoading: boolean;
	// 		logout: (callback: () => void) => void;
	// 		signIn: (email: string, password: string, callback: (err?: IMeteorError) => void) => void;
	// }

	// export interface IUserProfile extends IDoc {
	// 	photo?: string;
	// 	phone?: string;
	// 	username: string;
	// 	email: string;
	// 	roles?: string[];
	// 	status?: string;
	// }

	const options = [{ value: '', label: 'Nenhum' }, ...(controller.schema.type.options?.() ?? [])];

	return (
		<Container>
			isLoggedIn: {authContext.isLoggedIn ? 'Sim\n' : 'Não\n'}
			<br></br>
			userLoading: {authContext.userLoading ? 'Sim\n' : 'Não\n'}
			<br></br>
			usuario: {authContext.user?.username + '\n'}
			<br></br>
			email: {authContext.user?.email + '\n'}
			<br></br>
			roles: {authContext.user?.roles?.join(', ') + '\n'}
			<br></br>
			status: {authContext.user?.status + '\n'}
			<br></br>
			<Typography variant="h4">ToDos</Typography>
			<Typography variant="h5">Lista de Itens</Typography>
			<SearchContainer>
				<SysTextField
					name="search"
					placeholder="Pesquisar por nome"
					onChange={controller.onChangeTextField}
					startAdornment={<SysIcon name={'search'} />}
				/>
				<SysSelectField
					name="Category"
					label="Categoria"
					options={options}
					placeholder="Selecionar"
					onChange={controller.onChangeCategory}
				/>
			</SearchContainer>
			{controller.loading ? (
				<LoadingContainer>
					<CircularProgress />
					<Typography variant="body1">Aguarde, carregando informações...</Typography>
				</LoadingContainer>
			) : (
				<Box sx={{ width: '100%' }}>
					<ComplexTable
						data={controller.todoList}
						//data={controller.todoList.slice(0, 5)}
						schema={controller.schema}
						onRowClick={(row) => navigate('/toDos/view/' + row.id)}
						searchPlaceholder={'Pesquisar exemplo'}
						disableCheckboxSelection={false}
						onEdit={(row) => navigate('/toDos/edit/' + row._id)}
						pageSizeOptions={[5, 10, 20] as number[]}
						initialPageSize={5}
						onDelete={(row) => {
							DeleteDialog({
								showDialog: sysLayoutContext.showDialog,
								closeDialog: sysLayoutContext.closeDialog,
								title: `Excluir dado ${row.title}`,
								message: `Tem certeza que deseja excluir o arquivo ${row.title}?`,
								onDeleteConfirm: () => {
									controller.onDeleteButtonClick(row);
									sysLayoutContext.showNotification({
										message: 'Excluído com sucesso!'
									});
								}
							});
						}}
					/>
				</Box>
			)}
			<SysFab
				variant="extended"
				text="Adicionar"
				startIcon={<SysIcon name={'add'} />}
				fixed={true}
				onClick={controller.onAddButtonClick}
			/>
		</Container>
	);
};

export default ToDosListView;
