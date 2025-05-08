// region Imports
import { Recurso } from '../config/recursos';
import { toDosSch, IToDos } from './toDosSch';
import { userprofileServerApi } from '/imports/modules/userprofile/api/userProfileServerApi';
import { getUserServer } from '/imports/modules/userprofile/api/userProfileServerApi';
import { ProductServerBase } from '/imports/api/productServerBase';
import { IUserProfile } from '../../userprofile/api/userProfileSch';

import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { userprofileApi } from '../../userprofile/api/userProfileApi';

// endregion

class ToDosServerApi extends ProductServerBase<IToDos> {
	constructor() {
		super('toDos', toDosSch, {
			resources: Recurso
			// saveImageToDisk: true,
		});

		const self = this;

		// this.addPublication('toDosList', (filter = {}, options = {}) => {
		// 	const user = getUserServer();

		// 	return this.getCollectionInstance().find(
		// 		{
		// 			$or: [{ isPrivate: false }, { createdby: user._id }]
		// 			//	...filter
		// 		},
		// 		{
		// 			//...options,
		// 			// limit: 6,
		// 			sort: { createdat: -1 }
		// 		}
		// 	);
		// });

		// this.addTransformedPublication(
		// 	'toDosList',
		// 	async (filter = {}, options = {}) => {
		// 		const user = await Meteor.userAsync();
		// 		console.log('user_id: ', user._id);
		// 		return this.getCollectionInstance().find(
		// 			{
		// 				$or: [{ isPrivate: false }, { createdby: user._id }],
		// 				...filter
		// 			},
		// 			{
		// 				...options,
		// 				// limit: 6,
		// 				sort: { createdat: -1 }
		// 			}
		// 		);
		// 	},

		// 	async (doc: IToDos & { nomeUsuario: string }) => {
		// 		// console.log('Transforming doc:', doc._id);
		// 		const userProfileDoc = await userprofileServerApi.getCollectionInstance().findOneAsync({ _id: doc.createdby });
		// 		// console.log('User profile result:', userProfileDoc);
		// 		return { ...doc };
		// 		//return { ...doc, username: userProfileDoc.username };
		// 	}
		// );

		// 		`Meteor.user()` is deprecated on the server side.
		// W20250508-10:22:22.661(-3)? (STDERR)     To fetch the current user record on the server,
		// W20250508-10:22:22.662(-3)? (STDERR)     use `Meteor.userAsync()` instead.
		this.addPublication('toDosList', async (filter = {}, options = {}) => {
			//usando Meteor.userAsync() a query funciona
			const user = await Meteor.userAsync();
			// console.log('user_id: ', user._id);

			//espera conseguir o user id antes
			// if (!user?._id) {
			// 	return [];
			// }
			if (user?._id) {
				//pega só tasks publicas ou taks privadas mas do usuario logado
				const query = {
					$or: [{ isPrivate: false }, { createdby: user._id }],
					...filter
				};

				return toDosServerApi.getCollectionInstance().find(query, {
					...options,
					sort: { createdat: -1 }
				});
			}
		});

		//NAO FUNCNIONA:
		// this.addPublication('toDosList', function (filter = {}, options = {}) {
		// 	const user = await getUserServer(); esse getUserServer atrapalha a query do mongo de alguma forma, talvez pq ele retorna undefined ou pois ele é assincrono ou
		// por causa do observe() la do serverbase ??

		// 	return self.getCollectionInstance().find(
		// 		{
		// 			$or: [{ isPrivate: false }, { createdby: user._id }],
		// 			...filter
		// 		},
		// 		{
		// 			...options,
		// 			sort: { createdat: -1 }
		// 		}
		// 	);
		// });

		this.addPublication('toDosDetail', (filter = {}) => {
			return this.defaultDetailCollectionPublication(filter, {
				projection: {
					contacts: 1,
					title: 1,
					description: 1,
					createdBy: 1,
					type: 1,
					typeMulti: 1,
					date: 1,
					files: 1,
					chip: 1,
					statusRadio: 1,
					statusToggle: 1,
					slider: 1,
					check: 1,
					address: 1
				}
			});
		});

		this.addRestEndpoint(
			'view',
			(params, options) => {
				console.log('Params', params);
				console.log('options.headers', options.headers);
				return { status: 'ok' };
			},
			['post']

			// this.addPublication('toDosListResume', (filter = {}) => {
			// 	return this.defaultListCollectionPublication(filter, {
			// 		limit: 5,
			// 		sort: { createdat: -1 },
			// 		projection: { title: 1, type: 1, typeMulti: 1, createdat: 1 }
			// 	});
			// });
		);

		this.addRestEndpoint(
			'view/:toDosId',
			(params, _options) => {
				console.log('Rest', params);
				if (params.toDosId) {
					return self
						.defaultCollectionPublication(
							{
								_id: params.toDosId
							},
							{}
						)
						.then((cursor) => cursor.fetch());
				} else {
					return { ...params };
				}
			},
			['get']
		);

		//intuito: acessar as 5 tarefas alteradas mais recentes na Home, fora do contexto do modulo toDos
		this.addPublication('tarefasPublic', (filter = {}) => {
			return this.defaultCollectionPublication(filter, { sort: { createdat: -1 }, limit: 5 });

			// return this.getCollectionInstance().find(filter, {
			// 	limit: 5,
			// 	sort: { createdat: -1 }
			// });
		});

		//intuito: atalizar a categoria de uma task, pro ícone de check
		this.registerMethod('updateCategoria', (id: string, novaCategoria: string, callback?: (err: any) => void) => {
			// console.log('updateCategria id:', id, 'novaCategoria:', novaCategoria);
			const collection = this.getCollectionInstance();
			// console.log('updateCategria collection :', !!collection);

			const result = collection.updateAsync({ _id: id }, { $set: { type: novaCategoria } });

			// console.log('updateCategria update result:', result);
			return result;
		});
	}
}

export const toDosServerApi = new ToDosServerApi();
//export const toDosCollection = toDosServerApi.getCollectionInstance();
