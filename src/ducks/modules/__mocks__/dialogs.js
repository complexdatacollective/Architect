import uuid from 'uuid';

const OPEN_DIALOG = 'PROTOCOL/OPEN_DIALOG';
const CLOSE_DIALOG = 'PROTOCOL/CLOSE_DIALOG';

const openDialog = (dialog) => (dispatch) => new Promise((resolve) => {
  const onConfirm = () => {
    if (dialog.onConfirm) { dialog.onConfirm(); }
    resolve(true);
  };

  const onCancel = () => {
    if (dialog.onCancel) { dialog.onCancel(); }
    resolve(false);
  };

  dispatch({
    id: uuid(),
    type: OPEN_DIALOG,
    dialog: {
      ...dialog,
      onConfirm,
      onCancel,
    },
  });

  onConfirm();
});

const closeDialog = (id) => ({
  type: CLOSE_DIALOG,
  id,
});

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
