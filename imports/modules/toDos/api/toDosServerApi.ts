// region Imports
import { Recurso } from '../config/recursos';
import { toDosSch, IToDos } from './toDosSch';
import { userprofileServerApi } from '/imports/modules/userprofile/api/userProfileServerApi';
import { ProductServerBase } from '/imports/api/productServerBase';
import { IUserProfile } from '../../userprofile/api/userProfileSch';

// endregion

class ToDosServerApi extends ProductServerBase<IToDos> {
	constructor() {
		super('toDos', toDosSch, {
			resources: Recurso
			// saveImageToDisk: true,
		});

		const self = this;

		this.addTransformedPublication(
			'toDosList',
			(filter = {}, options = {}) => {
				return this.getCollectionInstance().find(filter, {
					...options,
					// limit: 6,
					sort: { createdat: -1 }
				});
			},
			// return this.defaultListCollectionPublication(filter, {
			// 	projection: { title: 1, type: 1, typeMulti: 1, createdat: 1 }
			// });

			// (doc: IToDos & { nomeUsuario: string }) => {
			// 	const userProfileDoc = await userprofileServerApi.getCollectionInstance().findOneAsync({ _id: doc.createdby });
			// 	return { ...doc };
			// }

			async (doc: IToDos & { nomeUsuario: string }) => {
				const userProfileDoc: IUserProfile = await userprofileServerApi
					.getCollectionInstance()
					.findOneAsync({ _id: doc.createdby });
				//return { ...doc };
				return { ...doc, username: userProfileDoc.username };
				// return { ...doc, user: userProfileDoc.username };
			}
		);

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
