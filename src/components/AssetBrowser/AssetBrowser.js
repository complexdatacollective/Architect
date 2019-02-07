import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { map } from 'lodash';
import window from '../../ui/components/window';
import BasicDialog from '../../ui/components/Dialog/Basic';
import Select from '../../components/Form/Fields/Select';
import Stackable from '../../components/Stackable';
import withAssets from './withAssets';

const ASSET_TYPES = [
  { label: 'Any', value: null },
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
  { label: 'Audio', value: 'audio' },
  { label: 'Network', value: 'network' },
];

const AssetBrowser = ({
  show,
  type,
  onCancel,
  assets,
  assetType,
  onUpdateAssetFilter,
  onSelectAsset,
}) => {
  const renderedAssets = map(assets, asset => (
    <div key={asset.id} onClick={() => onSelectAsset(asset.id)}>
      {asset.id}:{asset.source}
    </div>
  ));

  const selectProps = {
    options: ASSET_TYPES,
    input: {
      onChange: onUpdateAssetFilter,
      value: assetType,
    },
  };

  return (
    <Stackable stackKey={show}>
      {({ stackIndex }) => (
        <BasicDialog
          show={show}
          onBlur={onCancel}
          zIndex={stackIndex + 10000}
          title="Asset Browser"
        >
          Choose some assets
          { !type && <Select {...selectProps} /> }
          {renderedAssets}
        </BasicDialog>
      )}
    </Stackable>
  );
};

AssetBrowser.propTypes = {
  show: PropTypes.bool,
  onCancel: PropTypes.func,
};

AssetBrowser.defaultProps = {
  show: true,
  onCancel: () => {},
  stackIndex: null,
};

export default compose(
  window,
  withAssets,
)(AssetBrowser);
