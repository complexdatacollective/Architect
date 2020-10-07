import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import Assets from './Assets';
import NewAsset from './NewAsset';
import withAssetActions from './withAssetActions';

const AssetBrowser = ({
  type,
  selected,
  onSelect,
  onDelete,
}) => {
  const handleCreate = useCallback((assetIds) => {
    if (assetIds.length !== 1) { return; } // if multiple files were uploaded
    if (!assetIds[0]) { return; } // if a single invalid file was uploaded
    onSelect(assetIds[0]);
  }, [onSelect]);

  return (
    <div className="asset-browser">
      <div className="asset-browser__content">
        <div className="asset-browser__create">
          <NewAsset
            onCreate={handleCreate}
            type={type}
          />
        </div>
        <div className="asset-browser__assets">
          <h3>Asset library</h3>
          <Assets
            onSelect={onSelect}
            onDelete={onDelete}
            selected={selected}
            type={type}
          />
        </div>
      </div>
    </div>
  );
};

AssetBrowser.propTypes = {
  type: PropTypes.string,
  selected: PropTypes.string,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
};

AssetBrowser.defaultProps = {
  show: true,
  type: null,
  selected: null,
  onSelect: () => {},
  onDelete: () => {},
  stackIndex: null,
};

export default compose(
  withAssetActions,
)(AssetBrowser);
