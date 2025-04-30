import React, { useState } from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { SysFab } from '/imports/ui/components/sysFab/sysFab';
import { ToDosListControllerContext } from './toDosListController';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from '/imports/ui/appComponents/showDialog/custom/deleteDialog/deleteDialog';
import ToDosListStyles from './toDosListStyles';
import SysTextField from '/imports/ui/components/sysFormFields/sysTextField/sysTextField';
import { SysSelectField } from '/imports/ui/components/sysFormFields/sysSelectField/sysSelectField';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

// import { SysAppLayoutContext } from '/imports/app/appLayout';

import { DataGrid, GridColDef } from '@mui/x-data-grid';

// import { ToDosModuleContext } from '../../toDosContainer';
import AuthContext, { IAuthContext } from '/imports/app/authProvider/authContext';

// *imports para exibiçao da lista de tarefas
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Pagination from '@mui/material/Pagination';

const ITEMS_PER_PAGE = 5;

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

	const [page, setPage] = useState(1);

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

	const sortedList = (Array.isArray(controller.todoList) ? [...controller.todoList] : []).sort(
		(a, b) => (b.createdat || 0) - (a.createdat || 0)
	);

	const totalPages = Math.ceil(sortedList.length / ITEMS_PER_PAGE);
	const startIndex = (page - 1) * ITEMS_PER_PAGE;
	const paginatedItems = sortedList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

	// return (
	// 	<Container>
	// 		<Typography variant="h4">ToDos</Typography>
	// 		<Typography variant="h5">Lista de Itens</Typography>
	// 		<SearchContainer>
	// 			<SysTextField
	// 				name="search"
	// 				placeholder="Pesquisar por nome"
	// 				onChange={controller.onChangeTextField}
	// 				startAdornment={<SysIcon name={'search'} />}
	// 			/>
	// 			<SysSelectField
	// 				name="Category"
	// 				label="Categoria"
	// 				options={options}
	// 				placeholder="Selecionar"
	// 				onChange={controller.onChangeCategory}
	// 			/>
	// 		</SearchContainer>
	// 		{controller.loading ? (
	// 			<LoadingContainer>
	// 				<CircularProgress />
	// 				<Typography variant="body1">Aguarde, carregando informações...</Typography>
	// 			</LoadingContainer>
	// 		) : (
	// 			<Box sx={{ width: '100%' }}>
	// 				<List sx={{ width: '100%', /*maxWidth: 360,*/ bgcolor: 'background.paper' }}>
	// 					{Array.isArray(controller.todoList) &&
	// 						controller.todoList
	// 							.sort((a, b) => (b.createdat || 0) - (a.createdat || 0))
	// 							.map((task) => {
	// 								const labelId = `checkbox-list-label-${task.title}`;

	// 								return (
	// 									<ListItem
	// 										onClick={() => navigate('/toDos/view/' + task._id)}
	// 										sx={{ width: '100%' }}
	// 										key={task._id}
	// 										disablePadding>
	// 										<ListItemButton role={undefined} onClick={handleToggle(String(task._id))} dense>
	// 											<ListItemIcon>
	// 												<Checkbox
	// 													edge="start"
	// 													checked={checked.includes(String(task._id))}
	// 													tabIndex={-1}
	// 													disableRipple
	// 													inputProps={{ 'aria-labelledby': labelId }}
	// 												/>
	// 											</ListItemIcon>
	// 											<ListItemText id={labelId} primary={task.title} />
	// 										</ListItemButton>
	// 										<ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
	// 											<IconButton edge="end" aria-label="edit" onClick={() => {}}>
	// 												<EditIcon
	// 													onClick={() => {
	// 														controller.changeToEdit(task._id);
	// 													}}
	// 												/>
	// 											</IconButton>
	// 											<IconButton
	// 												edge="end"
	// 												aria-label="delete"
	// 												onClick={() => {
	// 													DeleteDialog({
	// 														showDialog: sysLayoutContext.showDialog,
	// 														closeDialog: sysLayoutContext.closeDialog,
	// 														title: `Excluir dado ${task.title}`,
	// 														message: `Tem certeza que deseja excluir o arquivo "${task.title}"?`,
	// 														onDeleteConfirm: () => {
	// 															controller.onDeleteButtonClick(task);
	// 															sysLayoutContext.showNotification({
	// 																message: 'Excluído com sucesso!'
	// 															});
	// 														}
	// 													});
	// 												}}>
	// 												<DeleteIcon />
	// 											</IconButton>
	// 										</ListItemSecondaryAction>
	// 									</ListItem>
	// 								);
	// 							})}
	// 				</List>
	// 			</Box>
	// 		)}
	// 		<SysFab
	// 			variant="extended"
	// 			text="Adicionar"
	// 			startIcon={<SysIcon name={'add'} />}
	// 			fixed={true}
	// 			onClick={controller.onAddButtonClick}
	// 		/>
	// 	</Container>
	// );
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
				<>
					<Box sx={{ width: '100%', minHeight: 300 }}>
						<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
							{paginatedItems.map((task) => {
								const labelId = `checkbox-list-label-${task.title}`;
								return (
									<ListItem
										onClick={() => navigate('/toDos/view/' + task._id)}
										sx={{ width: '100%' }}
										key={task._id}
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
										<ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
											<IconButton edge="end" aria-label="edit" onClick={() => controller.changeToEdit(task._id)}>
												<EditIcon />
											</IconButton>
											<IconButton
												edge="end"
												aria-label="delete"
												onClick={() => {
													DeleteDialog({
														showDialog: sysLayoutContext.showDialog,
														closeDialog: sysLayoutContext.closeDialog,
														title: `Excluir dado ${task.title}`,
														message: `Tem certeza que deseja excluir o arquivo "${task.title}"?`,
														onDeleteConfirm: () => {
															controller.onDeleteButtonClick(task);
															sysLayoutContext.showNotification({
																message: 'Excluído com sucesso!'
															});
														}
													});
												}}>
												<DeleteIcon />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								);
							})}
						</List>
					</Box>

					{totalPages > 1 && (
						<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
							<Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" />
						</Box>
					)}
				</>
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
