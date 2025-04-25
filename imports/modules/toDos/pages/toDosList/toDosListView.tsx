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

// *imports para exibiçao da lista de tarefas
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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

	const [checked, setChecked] = React.useState<string[]>([]);

	const handleToggle = (value: string) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	const options = [{ value: '', label: 'Nenhum' }, ...(controller.schema.type.options?.() ?? [])];

	return (
		<Container>
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
					<List sx={{ width: '100%', /*maxWidth: 360,*/ bgcolor: 'background.paper' }}>
						{controller.todoList.map((task) => {
							const labelId = `checkbox-list-label-${task.title}`;

							return (
								<ListItem
									sx={{ width: '100%' }}
									key={task._id}
									secondaryAction={
										<>
											<IconButton>
												<EditIcon />
											</IconButton>
											<IconButton>
												<DeleteIcon
													onClick={() => {
														DeleteDialog({
															showDialog: sysLayoutContext.showDialog,
															closeDialog: sysLayoutContext.closeDialog,
															title: `Excluir dado ${task.title}`,
															message: `Tem certeza que deseja excluir o arquivo ${task.title}?`,
															onDeleteConfirm: () => {
																controller.onDeleteButtonClick(task);
																sysLayoutContext.showNotification({
																	message: 'Excluído com sucesso!'
																});
															}
														});
													}}
												/>
											</IconButton>
										</>
									}
									disablePadding>
									<ListItemButton role={undefined} onClick={handleToggle(String(task._id))} dense>
										<ListItemIcon>
											<Checkbox
												edge="start"
												checked={checked.includes(String(task._id))}
												tabIndex={-1}
												disableRipple
												inputProps={{ 'aria-labelledby': labelId }}
											/>
										</ListItemIcon>
										<ListItemText id={labelId} primary={task.title} />
									</ListItemButton>
								</ListItem>
							);
						})}
					</List>
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
		/* isLoggedIn: {authContext.isLoggedIn ? 'Sim\n' : 'Não\n'}
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
			<br></br> */

		/* <ComplexTable
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
					/> */
	);
};

export default ToDosListView;
