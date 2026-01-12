import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { RadioGroup } from '@codaco/ui/lib/components/Fields';
import withAssets from './withAssets';
import Asset from './Asset';

const ASSET_TYPES = [
  { label: 'All Types', value: null },
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
  { label: 'Audio', value: 'audio' },
  { label: 'Network', value: 'network' },
  { label: 'GeoJSON', value: 'geojson' },
  { label: 'API Key', value: 'apikey' },
];

const Assets = ({
  type,
  assets,
  assetType,
  onUpdateAssetFilter,
  onSelect,
  onDelete,
  onDownload,
  onPreview,
  disableDelete,
}) => {
  const handleDelete = disableDelete ? null : onDelete;

  const renderedAssets = assets.map(({
    id,
    name,
    source,
    type: thumbnailType,
    isUsed,
  }) => {
    // disable download for apikey type
    const handleDownload = (thumbnailType === 'apikey') ? null : onDownload;

    return (
      <div className="asset-browser-assets__asset" key={id}>
        <Asset
          id={id}
          name={name}
          source={source}
          type={thumbnailType}
          isUsed={isUsed}
          onClick={onSelect}
          onPreview={onPreview}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      </div>
    );
  });

  return (
    <div className="asset-browser-assets">
      { !type
        && (
        <div className="asset-browser-assets__controls">
          <RadioGroup
            options={ASSET_TYPES}
            input={{
              onChange: onUpdateAssetFilter,
              value: assetType,
            }}
            label="Show types:"
          />
        </div>
        )}
      <div className="asset-browser-assets__assets">
        {assets.length > 0 ? renderedAssets : (<em>No resources to display.</em>)}
      </div>
    </div>
  );
};

const asset = PropTypes.shape({
  id: PropTypes.string,
  isUsed: PropTypes.bool,
  name: PropTypes.string,
  source: PropTypes.string,
  type: PropTypes.oneOf([
    'image',
    'video',
    'audio',
    'network',
  ]),
});

Assets.propTypes = {
  assets: PropTypes.arrayOf(asset),
  assetType: PropTypes.string,
  disableDelete: PropTypes.bool,
  onDelete: PropTypes.func,
  onDownload: PropTypes.func,
  onPreview: PropTypes.func,
  onSelect: PropTypes.func,
  onUpdateAssetFilter: PropTypes.func.isRequired,
  type: PropTypes.string,
};

Assets.defaultProps = {
  assets: [],
  assetType: null,
  disableDelete: false,
  onDelete: null,
  onDownload: () => {},
  onPreview: () => {},
  onSelect: () => {},
  type: null,
};

export default compose(
  withAssets,
)(Assets);
