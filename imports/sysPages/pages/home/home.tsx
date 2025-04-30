import React from 'react';
import HomeSectionNotificacoes from './sections/notificacoes';
import HomeSectionDialogs from './sections/dialogs';
import HomeStyles from './homeStyle';
import HomeSectionComponents from '/imports/sysPages/pages/home/sections/componentTests';
// import { toDosServerApi } from '../../../modules/toDos/api/toDosServerApi';

import { CircularProgress, Typography } from '@mui/material';

import { useCallback, useMemo } from 'react';

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

import Button from '@mui/material/Button';

const Home: React.FC = () => {
	const { Container, Header } = HomeStyles;
	//const { Container, Header, LoadingContainer, ContainerBody } = HomeStyles;

	const { user } = React.useContext(AuthContext);

	// // const { Container, LoadingContainer, SearchContainer } = ExampleListStyles;
	// // const sysLayoutContextt = React.useContext(SysAppLayoutContext);
	const sysLayoutContext = React.useContext<IAppLayoutContext>(AppLayoutContext);
	const navigate = useNavigate();
	// const options = [{ value: '', label: 'Nenhum' }, ...(controller.schema.type?.options?.() ?? [])];

	const handleToDosFiveInfo = toDosApi.subscribe('tarefasPublic');

	const fiveRecentTasks = useTracker(() => {
		const handle = toDosApi.subscribe('tarefasPublic');
		if (!handle.ready()) return [];
		return toDosApi.find({}, { sort: { createdAt: -1 }, limit: 5 }).fetch();
	}, []);

	console.log('here: ', toDosApi.find({}).fetch());

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

	return (
		<Container>
			<Header>
				<Typography variant="h3">Olá, {user?.username}</Typography>
				<Typography variant="body1" textAlign={'justify'}>
					Seus projetos muito mais organizados. Veja as tarefas adicionadas por seu time, por você e para você.
				</Typography>
			</Header>

			<div>
				<Typography variant="h2">To-Do List</Typography>
				<Typography variant="body1" textAlign={'justify'}>
					Tarefas recentes
				</Typography>
			</div>
			<List sx={{ width: '100%', /*maxWidth: 360,*/ bgcolor: 'background.paper' }}>
				{toDosApi
					.find({})
					.fetch()
					.map((task) => {
						const labelId = `checkbox-list-label-${task.title}`;

						return (
							<ListItem
								key={task._id}
								secondaryAction={
									<>
										<IconButton>
											<EditIcon />
										</IconButton>
										<IconButton>
											<DeleteIcon />
										</IconButton>
									</>
									// <IconButton>
									// 		<DeleteIcon/>

									// </IconButton>
								}
								disablePadding>
								<ListItemButton role={undefined} onClick={handleToggle(task._id)} dense>
									<ListItemIcon>
										<Checkbox
											edge="start"
											checked={checked.includes(task._id)}
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
