import ToDosContainer from '../toDosContainer';
import { Recurso } from './recursos';
import { IRoute } from '/imports/modules/modulesTypings';
import signIn from '/imports/sysPages/pages/signIn/signIn';

export const toDosRouterList: (IRoute | null)[] = [
	{
		path: '/toDos/:screenState/:toDosId',
		component: ToDosContainer,
		isProtected: true,
		// resources: [Recurso.EXAMPLE_VIEW]
		resources: [Recurso.TODOS_VIEW]
	},
	{
		path: '/toDos/:screenState',
		component: ToDosContainer,
		isProtected: true,
		// resources: [Recurso.EXAMPLE_CREATE]
		resources: [Recurso.TODOS_CREATE]
	},
	{
		path: '/toDos',
		component: ToDosContainer,
		isProtected: true,
		// resources: [Recurso.EXAMPLE_VIEW]
		resources: [Recurso.TODOS_VIEW]
	}
	//isso é fora do modulo
	// {
	// 	path: '/sign-in',
	// 	component: signIn,
	// 	isProtected: false
	// 	// resources: [Recurso.EXAMPLE_VIEW]
	// 	// resources: [Recurso.TODOS_VIEW]
	// }
];
