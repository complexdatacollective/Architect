import { connect } from 'react-redux';
import {
  compose,
  withHandlers,
} from 'recompose';
import { actionCreators as assetActions } from '../../ducks/modules/protocol/assetManifest';

const assetStore = connect(
  null,
  {
    deleteAsset: assetActions.deleteAsset,
  },
);

const assetHandlers = withHandlers({
  onDelete: ({ deleteAsset }) =>
    (assetId) => {
      deleteAsset(assetId);
    },
});

const withAssets = compose(
  assetStore,
  assetHandlers,
);

export default withAssets;
