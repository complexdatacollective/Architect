import { connect } from 'react-redux';
import {
  filter,
  map,
} from 'lodash';
import {
  compose,
  withState,
  withHandlers,
} from 'recompose';
import { getAssetManifest } from '../../selectors/protocol';

const filterByAssetType = (assetType, assets) => (
  assetType ?
    filter(assets, ({ type }) => type === assetType) :
    assets
);

const withKeysAsIds = assets =>
  map(assets, (asset, id) => ({ ...asset, id }));

const filterAssets = (assetType, assets) =>
  filterByAssetType(
    assetType,
    withKeysAsIds(assets),
  );

const filterHandlers = withHandlers({
  onUpdateAssetFilter: ({ setAssetType }) =>
    assetType => setAssetType(assetType),
});

const mapStateToProps = (state, { assetType }) => {
  const assets = getAssetManifest(state);

  return {
    assets: filterAssets(assetType, assets),
  };
};

const withAssets = compose(
  withState('assetType', 'setAssetType', ({ type }) => type),
  filterHandlers,
  connect(mapStateToProps),
);

export default withAssets;
