import { IDoc } from '/imports/typings/IDoc';
import { ISchema } from '/imports/typings/ISchema';

import { validarEmail } from '../../../libs/validaEmail';
import { string } from 'prop-types';

export const signUpSchema: ISchema<ISignUp> = {
	nome: {
		type: 'String',
		label: 'nome',
		optional: false
	},
	email: {
		type: 'String',
		label: 'email',
		optional: false,
		validationFunction: (value: string) => {
			if (!value) return undefined;
			const email = validarEmail(value);
			if (!email) return 'Email inválido';
			return undefined;
		}
	},
	password: {
		type: 'String',
		label: 'email',
		optional: false
	}
};

export interface ISignUp extends IDoc {
	nome: string;
	email: string;
	password: string;
}
