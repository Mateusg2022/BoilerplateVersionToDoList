import React, { createContext, useCallback, useContext } from 'react';
import ToDosDetailView from './toDosDetailView';
import { useNavigate } from 'react-router-dom';
import { ToDosModuleContext } from '../../toDosContainer';
import { useTracker } from 'meteor/react-meteor-data';
import { toDosApi } from '../../api/toDosApi';
import { IToDos } from '../../api/toDosSch';
import { ISchema } from '/imports/typings/ISchema';
import { IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
// import { SysAppLayoutContext } from '/imports/app/appLayout';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

import AuthContext, { IAuthContext } from '/imports/app/authProvider/authContext';

interface IToDosDetailContollerContext {
	closePage: () => void;
	document: IToDos;
	loading: boolean;
	schema: ISchema<IToDos>;
	onSubmit: (doc: IToDos) => void;
	changeToEdit: (id: string) => void;
}

export const ToDosDetailControllerContext = createContext<IToDosDetailContollerContext>(
	{} as IToDosDetailContollerContext
);

const ToDosDetailController = () => {
	const navigate = useNavigate();
	const { id, state } = useContext(ToDosModuleContext);
	// const { showNotification } = useContext(SysAppLayoutContext);
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

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

	const { document, loading } = useTracker(() => {
		const subHandle = !!id ? toDosApi.subscribe('toDosDetail', { _id: id }) : null;
		const document = id && subHandle?.ready() ? toDosApi.findOne({ _id: id }) : {};
		return {
			document: (document as IToDos) ?? ({ _id: id } as IToDos),
			loading: !!subHandle && !subHandle?.ready()
		};
	}, [id]);

	const closePage = useCallback(() => {
		navigate(-1);
	}, []);

	const changeToEdit = useCallback((id: string) => {
		navigate(`/toDos/edit/${id}`);
	}, []);

	const onSubmit = useCallback((doc: IToDos) => {
		const selectedAction = state === 'create' ? 'insert' : 'update';
		toDosApi[selectedAction](doc, (e: IMeteorError) => {
			if (!e) {
				closePage();
				showNotification({
					type: 'success',
					title: 'Operação realizada!',
					message: `A tarefa foi ${selectedAction === 'update' ? 'atualizada' : 'cadastrada'} com sucesso!`
				});
			} else {
				showNotification({
					type: 'error',
					title: 'Operação não realizada!',
					message: `Erro ao realizar a operação: ${e.reason}`
				});
			}
		});
	}, []);

	return (
		<ToDosDetailControllerContext.Provider
			value={{
				closePage,
				document: { ...document, _id: id },
				loading,
				schema: toDosApi.getSchema(),
				onSubmit,
				changeToEdit
			}}>
			{<ToDosDetailView />}
		</ToDosDetailControllerContext.Provider>
	);
};

export default ToDosDetailController;
