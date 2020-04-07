import React from 'react';
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
}) => (
  <div className="asset-browser">
    <div className="asset-browser__content">
      <div className="asset-browser__create">
        <NewAsset
          onCreate={onSelect}
          type={type}
        />
      </div>
      <div className="asset-browser__assets">
        <h3>Choose asset from library</h3>
        {/* <Assets
          onSelect={onSelect}
          onDelete={onDelete}
          selected={selected}
          type={type}
        /> */}
      </div>
    </div>
  </div>
);

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
