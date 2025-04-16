import React from 'react';
import { IAppMenu } from '/imports/modules/modulesTypings';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';

export const toDosMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/toDos',
		//name: 'Exemplo',
		name: 'ToDos',
		icon: <SysIcon name={'dashboard'} />
	}
];
