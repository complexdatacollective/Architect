import { filter, map } from 'lodash';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';

import { getAssetIndex, utils as indexUtils } from '../../selectors/indexes';
import { getAssetManifest } from '../../selectors/protocol';

const filterByAssetType = (assetType, assets) =>
  assetType ? filter(assets, ({ type }) => type === assetType) : assets;

const withKeysAsIds = (assets) =>
  map(assets, (asset, id) => ({ ...asset, id }));

const filterAssets = (assetType, assets) =>
  filterByAssetType(assetType, withKeysAsIds(assets));

const filterHandlers = withHandlers({
  onUpdateAssetFilter:
    ({ setAssetType }) =>
    (assetType) =>
      setAssetType(assetType),
});

const mapStateToProps = (state, { assetType, selected }) => {
  const allAssets = getAssetManifest(state);
  const filteredAssets = filterAssets(assetType, allAssets);
  // Get asset usage index
  const assetIndex = getAssetIndex(state);
  const assetSearch = indexUtils.buildSearch([assetIndex]);

  // Check for asset usage
  const assets = filteredAssets.map((asset) => {
    const isUsed = assetSearch.has(asset.id) || asset.id === selected;

    return {
      ...asset,
      isUsed,
    };
  });

  return {
    assets,
  };
};

const withAssets = compose(
  withState('assetType', 'setAssetType', ({ type }) => type),
  filterHandlers,
  connect(mapStateToProps),
);

export default withAssets;
