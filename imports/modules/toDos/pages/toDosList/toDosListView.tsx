import React, { useState } from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { SysFab } from '/imports/ui/components/sysFab/sysFab';
import { ToDosListControllerContext } from './toDosListController';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from '/imports/ui/appComponents/showDialog/custom/deleteDialog/deleteDialog';
//import ShowDrawer from '/imports/ui/appComponents/showDrawer/showDrawer';
import ToDosListStyles from './toDosListStyles';
import SysTextField from '/imports/ui/components/sysFormFields/sysTextField/sysTextField';
import { SysSelectField } from '/imports/ui/components/sysFormFields/sysSelectField/sysSelectField';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

// import { SysAppLayoutContext } from '../../../../app/appLayoutProvider';

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
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import toDosApi from '../../api/toDosApi';

import { userprofileApi } from '../../../userprofile/api/userProfileApi';

import { useTracker } from 'meteor/react-meteor-data';

import { IDefaultContainerProps } from 'imports/typings/BoilerplateDefaultTypings';

import { useLocation, useParams } from 'react-router-dom';

import ToDosDetailView from '../toDosDetail/toDosDetailView';

import Modal from '@mui/material/Modal';
import { ToDosDetailControllerContext } from '../toDosDetail/toDosDetailContoller';
import ToDosDetailController from '../toDosDetail/toDosDetailContoller';
import { ToDosModuleContext } from '../../toDosContainer';

import CloseIcon from '@mui/icons-material/Close';

const ITEMS_PER_PAGE = 5;

const ToDosListView = () => {
	const controller = React.useContext(ToDosListControllerContext);

	const detailController = React.useContext(ToDosDetailControllerContext);
	// const { Container, LoadingContainer, SearchContainer } = ExampleListStyles;
	const sysLayoutContextt = React.useContext(AppLayoutContext);
	const sysLayoutContext = React.useContext<IAppLayoutContext>(AppLayoutContext);
	const navigate = useNavigate();
	const { Container, LoadingContainer, SearchContainer } = ToDosListStyles;

	const authContext = React.useContext<IAuthContext>(AuthContext);

	const isReady = useTracker(() => {
		const handleUserProfileApi = userprofileApi.subscribe('userProfileList');
		return handleUserProfileApi.ready();
	}, []);
	// if (!handleUserProfileApi.ready()) {
	// 	return 'carregando...';
	// }
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

	const searchUsernameById = (id: string): string | undefined => {
		const user = userprofileApi.findOne({ _id: id });
		return user?.username;
	};

	const modalStyle = {
		position: 'absolute' as const,
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '90%',
		maxWidth: 600,
		bgcolor: 'background.paper',
		boxShadow: 24,
		p: 4,
		borderRadius: 2
	};

	const [isOpen, setIsOpen] = useState(false);
	const [currentId, setCurrentId] = useState<string | undefined>(undefined);

	const moduleState = {
		id: currentId,
		state: 'view' //'create', 'edit'
	};

	const { document, onSubmit } = React.useContext(ToDosDetailControllerContext);

	const handleCheckboxClick = (taskId: string | undefined) => {
		if (taskId == undefined) return;

		/**  */
		Meteor.call('toDos.updateCategoria', taskId, 'Concluída', (err) => {
			if (err) {
				console.error('Erro ao atualizar categoria:', err.reason);
			} else {
				console.log('Categoria atualizada com sucesso!');
			}
		});
		/** */
	};

	return (
		<Container>
			{/* testando o modal */}
			<Modal
				open={isOpen}
				onClose={() => {
					setIsOpen(false);
					setCurrentId(undefined);
				}}>
				<Box sx={modalStyle}>
					<IconButton
						aria-label="close"
						onClick={() => {
							setIsOpen(false);
							setCurrentId(undefined);
						}}
						sx={{
							position: 'absolute',
							right: 8,
							top: 8,
							color: (theme) => theme.palette.grey[500]
						}}>
						<CloseIcon />
					</IconButton>

					{/* conteudo do modal */}
					<ToDosModuleContext.Provider value={moduleState}>
						<ToDosDetailController />
					</ToDosModuleContext.Provider>
				</Box>
			</Modal>

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
										//onClick={() => navigate('/toDos/view/' + task._id)}
										// onClick={() => {
										// 	setCurrentId(task._id);
										// 	setIsOpen(true);
										// }}
										sx={{ width: '100%' }}
										key={task._id}
										disablePadding>
										{/* <Modal open={isOpen} onClose={() => setIsOpen(false)}>
											<Box sx={modalStyle}>
												<ToDosModuleContext.Provider value={moduleState}>
													<ToDosDetailController />
												</ToDosModuleContext.Provider>
											</Box>
										</Modal> */}
										<ListItemButton
											onClick={() => {
												setCurrentId(task._id);
												setIsOpen(true);
											}}
											role={undefined}
											dense
											// removido handleToggle daqui para evitar marcação ao clicar no corpo
										>
											<ListItemIcon>
												<Checkbox
													edge="start"
													checked={checked.includes(String(task._id))}
													tabIndex={-1}
													disableRipple
													inputProps={{ 'aria-labelledby': labelId }}
													onClick={(e) => {
														{
															e.stopPropagation();
															handleCheckboxClick(task._id);
														}
													}}
													onChange={handleToggle(String(task._id))}
												/>
											</ListItemIcon>
											<KeyboardArrowRightIcon />
											<ListItemText
												id={labelId}
												primary={
													<Typography variant="h6" fontWeight="bold" color="primary">
														{' ' + task.title}
													</Typography>
												}
												secondary={
													<Typography color="primary">{' ' + searchUsernameById(task.createdby || '')}</Typography>
												}
											/>
										</ListItemButton>
										<ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
											<IconButton
												edge="end"
												aria-label="edit"
												onClick={() => {
													if (task.createdby === authContext?.user?.username) {
														controller.changeToEdit(task._id);
													} else {
														//alert('Essa tarefa pertence a outro usuário');
														sysLayoutContext.showNotification({
															title: 'Autorização negada.',
															message: 'Essa tarefa pertence a outro usuário',
															type: 'default',
															showCloseButton: true,
															actionButtonTex: 'Fechar',
															duration: 3000
														});
													}
												}}>
												<EditIcon />
											</IconButton>
											<IconButton
												edge="end"
												aria-label="delete"
												onClick={() => {
													if (task.createdby === authContext?.user?.username) {
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
													} else {
														//alert('Essa tarefa pertence a outro usuário');
														sysLayoutContext.showNotification({
															title: 'Autorização negada.',
															message: 'Essa tarefa pertence a outro usuário',
															type: 'default',
															showCloseButton: true,
															actionButtonTex: 'Fechar',
															duration: 3000
														});
													}
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
