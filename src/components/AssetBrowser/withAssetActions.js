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
    openDialog: dialogActions.openDialog,
  },
);

const assetHandlers = withHandlers({
  onDelete: ({ deleteAsset, openDialog }) =>
    (assetId, isUsed = false) => {
      if (isUsed) {
        openDialog({
          type: 'Notice',
          title: 'Cannot delete asset',
          message: 'Cannot delete this asset because it is used by the protocol.',
          confirmLabel: 'Ok',
        });
        return;
      }

      openDialog({
        type: 'Confirm',
        title: 'Delete Asset',
        message: 'Are you sure you want to delete this asset?',
        confirmLabel: 'Delete asset',
        onConfirm: () => deleteAsset(assetId),
      });
    },
});

const withAssets = compose(
  connectActions,
  assetHandlers,
);

export default withAssets;
