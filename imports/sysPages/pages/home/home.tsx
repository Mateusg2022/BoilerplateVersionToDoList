import React from 'react';
import HomeSectionNotificacoes from './sections/notificacoes';
import HomeSectionDialogs from './sections/dialogs';
import HomeStyles from './homeStyle';
import HomeSectionComponents from '/imports/sysPages/pages/home/sections/componentTests';
// import { toDosServerApi } from '../../../modules/toDos/api/toDosServerApi';

import { CircularProgress, Typography } from '@mui/material';

import { useCallback, useMemo } from 'react';

import { useState } from 'react';
import AuthContext from '/imports/app/authProvider/authContext';
import { useNavigate } from 'react-router-dom';

import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

import SysTextField from '/imports/ui/components/sysFormFields/sysTextField/sysTextField';
import { SysSelectField } from '/imports/ui/components/sysFormFields/sysSelectField/sysSelectField';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import Box from '@mui/material/Box';
import { ComplexTable } from '/imports/ui/components/ComplexTable/ComplexTable';
import DeleteDialog from '/imports/ui/appComponents/showDialog/custom/deleteDialog/deleteDialog';
import { SysFab } from '/imports/ui/components/sysFab/sysFab';

import { Mongo } from 'meteor/mongo';
import { useTracker } from 'meteor/react-meteor-data';

import { toDosApi } from '../../../../imports/modules/toDos/api/toDosApi';
//import { ToDosC } from 'imports/modules/toDos/api/toDosClientCollection';

// *imports para estilização
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
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import Button from '@mui/material/Button';

import Modal from '@mui/material/Modal';
import ToDosDetailController from '../../../modules/toDos/pages/toDosDetail/toDosDetailContoller';
import { ToDosModuleContext } from '../../../modules/toDos/toDosContainer';

import { userprofileApi } from '../../../modules/userprofile/api/userProfileApi';

import CloseIcon from '@mui/icons-material/Close';

import SysFonts from '../../../ui/materialui/sysFonts';

const Home: React.FC = () => {
	const { Container, Header } = HomeStyles;
	//const { Container, Header, LoadingContainer, ContainerBody } = HomeStyles;

	const { user } = React.useContext(AuthContext);

	// const { Container, LoadingContainer, SearchContainer } = ExampleListStyles;
	// const sysLayoutContextt = React.useContext(SysAppLayoutContext);
	const sysLayoutContext = React.useContext<IAppLayoutContext>(AppLayoutContext);
	const navigate = useNavigate();
	// const options = [{ value: '', label: 'Nenhum' }, ...(controller.schema.type?.options?.() ?? [])];

	// const handleToDosFiveInfo = toDosApi.subscribe('tarefasPublic');

	const fiveRecentTasks = useTracker(() => {
		const handle = toDosApi.subscribe('tarefasPublic');
		if (!handle.ready()) return [];
		return toDosApi.find({}, { sort: { createdAt: -1 }, limit: 5 }).fetch();
	}, []);

	// console.log('here: ', toDosApi.find({}).fetch());

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

	const isReady = useTracker(() => {
		const handleUserProfileApi = userprofileApi.subscribe('userProfileList');
		return handleUserProfileApi.ready();
	}, []);

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

	const searchUsernameById = (id: string): string | undefined => {
		const user = userprofileApi.findOne({ _id: id });
		return user?.username;
	};

	return (
		<Container>
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
			<Header>
				<Typography variant="h2">Olá, {user?.username}</Typography>
				<Typography variant="body1" textAlign={'justify'}>
					Seus projetos muito mais organizados. Veja as tarefas adicionadas por seu time, por você e para você.
				</Typography>
			</Header>
			<div>
				<Typography variant="h3">Atividades recentes</Typography>
				{/* <Typography variant="body1" textAlign={'justify'}>
					Tarefas recentes
				</Typography> */}
			</div>

			<>
				<Box sx={{ width: '100%', minHeight: 300 }}>
					<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
						{toDosApi
							.find({})
							.fetch()
							.map((task) => {
								const labelId = `checkbox-list-label-${task.title}`;
								return (
									<ListItem sx={{ width: '100%' }} key={task._id} disablePadding>
										<ListItemButton
											onClick={() => {
												setCurrentId(task._id);
												setIsOpen(true);
											}}
											role={undefined}
											dense>
											<KeyboardArrowRightIcon />
											<ListItemText
												id={labelId}
												//se a tarefa estiver marcada, o texto fica grifado
												primary={
													checked.includes(String(task._id)) || task.type == 'Concluída' ? (
														<Typography
															sx={{ ...SysFonts.h6(), textDecoration: 'line-through', fontWeight: 'bold' }}
															color="primary">
															{' ' + task.title}
														</Typography>
													) : (
														<Typography sx={{ ...SysFonts.h6(), fontWeight: 'bold' }} fontWeight="bold" color="primary">
															{' ' + task.title}
														</Typography>
													)
												}
												secondary={
													<Typography sx={{ ...SysFonts.body1() }} color="primary">
														Criada por:{' '}
														<Typography component="span" sx={SysFonts.link()} color="primary">
															{searchUsernameById(task.createdby || '')}
														</Typography>
													</Typography>
												}
											/>
										</ListItemButton>
									</ListItem>
								);
							})}
					</List>
				</Box>
			</>
			{/** */}
			<Button variant="contained" onClick={() => navigate('/toDos')}>
				Minhas Tarefas
			</Button>
		</Container>
	);
};

export default Home;
/* <HomeSectionNotificacoes />
			<HomeSectionDialogs />
			<HomeSectionComponents /> */
/* <Typography variant="h5">Lista de Itens</Typography>
				<SearchContainer>
					<SysTextField
						name="search"
						placeholder="Pesquisar por nome"
						onChange={controller.onChangeTextField}
						startAdornment={<SysIcon name={'search'} />}
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
							schema={controller.schema}
							onRowClick={(row) => navigate('/toDos/view/' + row.id)}
							searchPlaceholder={'Pesquisar exemplo'}
							onEdit={(row) => navigate('/toDos/edit/' + row._id)}
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
				{/*
			<SysFab
				variant="extended"
				text="Adicionar"
				startIcon={<SysIcon name={'add'} />}
				fixed={true}
				onClick={controller.onAddButtonClick}
			/> */
