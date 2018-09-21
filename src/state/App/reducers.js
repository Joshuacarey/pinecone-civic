import { 
	OPEN,
 } from './constants.js';

const initialState = {
	open: true,
}

export const sideBar = (state=initialState, action={}) => {
	switch(action.type) {
		case OPEN:
			return Object.assign({}, state, { open: action.payload });
		default: 
			return state;
	}
}
