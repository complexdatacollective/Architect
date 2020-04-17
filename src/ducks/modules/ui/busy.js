import { actionTypes as protocolsActionTypes } from '../protocols/index';

const initialState = [];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case protocolsActionTypes.OPEN_START:
      return [...state, { type: 'LOADING' }];
    case protocolsActionTypes.OPEN_COMPLETE:
    case protocolsActionTypes.UNBUNDLE_AND_LOAD_ERROR:
    case protocolsActionTypes.CREATE_AND_LOAD_ERROR:
      return state.filter(({ type }) => type !== 'LOADING');
    default:
      return state;
  }
}
