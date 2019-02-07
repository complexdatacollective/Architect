import { connect } from 'react-redux';
import {
  filter,
} from 'lodash';
import {
  compose,
  withState,
  withHandlers,
} from 'recompose';
import { getAssetManifest } from '../../selectors/protocol';

const filterByAssetType = (assets, assetType) => (
  assetType ?
    filter(
      assets,
      ({ type }) => type === assetType,
    ) :
    assets
);

const filterHandlers = withHandlers({
  onUpdateAssetFilter: ({ setAssetType }) =>
    assetType => setAssetType(assetType),
});

const mapStateToProps = (state, { assetType }) => {
  const assets = getAssetManifest(state);

  return {
    assets: filterByAssetType(assets, assetType),
  };
};

const withAssets = compose(
  withState('assetType', 'setAssetType', ({ type }) => type),
  filterHandlers,
  connect(mapStateToProps),
);

export default withAssets;
