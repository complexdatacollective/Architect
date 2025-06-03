import { connect } from 'react-redux';
import {
  compose,
  withHandlers,
} from 'recompose';
import { actionCreators as assetActions } from '../../ducks/modules/protocol/assetManifest';
import { actionCreators as dialogActions } from '../../ducks/modules/dialogs';

const connectActions = connect(
  null,
  {
    deleteAsset: assetActions.deleteAsset,
    importAsset: assetActions.importAsset,
    openDialog: dialogActions.openDialog,
  },
);

const assetHandlers = withHandlers({
  onDelete: ({ deleteAsset, openDialog }) => (assetId, isUsed = false) => {
    if (isUsed) {
      openDialog({
        type: 'Notice',
        title: 'Cannot delete resource',
        message: 'Cannot delete this resource because it is used within your interview. Remove any uses of the resource, and try again.',
        confirmLabel: 'Ok',
      });
      return;
    }

    openDialog({
      type: 'Warning',
      title: 'Delete Resource?',
      message: 'Are you sure you want to delete this resource? This action cannot be undone.',
      confirmLabel: 'Delete Resource',
      onConfirm: () => deleteAsset(assetId),
    });
  },
});

const withAssets = compose(
  connectActions,
  assetHandlers,
);

export default withAssets;
