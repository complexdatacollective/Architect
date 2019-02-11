import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import Select from '../../components/Form/Fields/Select';
import withAssets from './withAssets';
import Asset from './Asset';

const ASSET_TYPES = [
  { label: 'Any', value: null },
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
  { label: 'Audio', value: 'audio' },
  { label: 'Network', value: 'network' },
];

const Assets = ({
  type,
  assets,
  assetType,
  onUpdateAssetFilter,
  onSelect,
}) => {
  const renderedAssets = assets.map(asset => (
    <div className="asset-browser-assets__asset" key={asset.id}>
      <Asset
        {...asset}
        onClick={onSelect}
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

  return (
    <div className="asset-browser-assets">
      { !type &&
        <div className="asset-browser-assets__controls">
          <Select {...selectProps} />
        </div>
      }

      <div className="asset-browser-assets__assets">
        {renderedAssets}
      </div>
    </div>
  );
};

Assets.propTypes = {
  type: PropTypes.string,
  onSelect: PropTypes.func,
};

Assets.defaultProps = {
  type: null,
  onSelect: () => {},
};

export default compose(
  withAssets,
)(Assets);
