import uuid from 'uuid';

const OPEN_DIALOG = Symbol('PROTOCOL/OPEN_DIALOG');
const CLOSE_DIALOG = Symbol('PROTOCOL/CLOSE_DIALOG');

const initialState = {
  dialogs: [],
};

const openDialog = dialog =>
  ({
    id: uuid(),
    type: OPEN_DIALOG,
    dialog,
  });

const closeDialog = id =>
  ({
    type: CLOSE_DIALOG,
    id,
  });

function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case OPEN_DIALOG:
      return {
        ...state,
        dialogs: [
          ...state.dialogs,
          { id: action.id, ...action.dialog },
        ],
      };
    case CLOSE_DIALOG:
      return {
        ...state,
        dialogs: state.dialogs.filter(dialog => dialog.id !== action.id),
      };
    default:
      return state;
  }
}

const actionCreators = {
  openDialog,
  closeDialog,
};

const actionTypes = {
  OPEN_DIALOG,
  CLOSE_DIALOG,
};

export {
  actionCreators,
  actionTypes,
};

export default reducer;
