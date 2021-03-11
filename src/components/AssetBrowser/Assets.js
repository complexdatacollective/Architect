import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { RadioGroup } from '@codaco/ui/lib/components/Fields';
import withAssets from './withAssets';
import Thumbnail from './Thumbnail';

const ASSET_TYPES = [
  { label: 'All Types', value: null },
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
  onDelete,
  disableDelete,
}) => {
  const handleDelete = !disableDelete && onDelete;

  const renderedAssets = assets.map((asset) => (
    <div className="asset-browser-assets__asset" key={asset.id}>
      <Thumbnail
        {...asset}
        onClick={onSelect}
        onDelete={handleDelete}
      />
    </div>
  ));

  const selectProps = {
    options: ASSET_TYPES,
    input: {
      onChange: onUpdateAssetFilter,
      value: assetType,
    },
    label: 'Show types:',
  };

  return (
    <div className="asset-browser-assets">
      { !type
        && (
        <div className="asset-browser-assets__controls">
          <RadioGroup {...selectProps} />
        </div>
        )}
      <div className="asset-browser-assets__assets">
        {assets.length > 0 ? renderedAssets : (<em>No resources to display.</em>)}
      </div>
    </div>
  );
};

Assets.propTypes = {
  type: PropTypes.string,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
  assets: PropTypes.array,
  assetType: PropTypes.string,
  onUpdateAssetFilter: PropTypes.func.isRequired,
  disableDelete: PropTypes.bool,
};

Assets.defaultProps = {
  type: null,
  onSelect: () => {},
  onDelete: null,
  assets: [],
  assetType: null,
  disableDelete: false,
};

export default compose(
  withAssets,
)(Assets);
