import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import window from '../../ui/components/window';
import Button from '../../ui/components/Button';
import BasicDialog from '../../ui/components/Dialog/Basic';
import Select from '../../components/Form/Fields/Select';
import Stackable from '../../components/Stackable';
import withAssets from './withAssets';
import Asset from './Asset';

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
  const renderedAssets = assets.map(asset => (
    <div className="asset-browser__assets-asset" key={asset.id}>
      <Asset
        {...asset}
        onClick={onSelectAsset}
      />
    </div>
  ));

  const selectProps = {
    options: ASSET_TYPES,
    input: {
      onChange: onUpdateAssetFilter,
      value: assetType,
    },
  };

  const cancelButton = (
    <Button
      color="white"
      onClick={onCancel}
    >
      Cancel
    </Button>
  );

  return (
    <Stackable stackKey={show}>
      {({ stackIndex }) => (
        <BasicDialog
          show={show}
          onBlur={onCancel}
          zIndex={stackIndex + 10000}
          title="Asset Browser"
          options={cancelButton}
        >
          <p>Please select an asset</p>
          { !type && <Select {...selectProps} /> }
          <div className="asset-browser__assets">
            {renderedAssets}
          </div>
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
