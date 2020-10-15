import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '@codaco/ui/lib/components/Icon';
import * as Thumbnails from '@components/Thumbnail';

const FallBackAssetComponent = () => (
  <div>No preview component available for this asset type.</div>
);

const ASSET_COMPONENTS = {
  image: Thumbnails.Image,
  video: Thumbnails.Video,
  audio: Thumbnails.Audio,
  network: Thumbnails.Network,
};

class Asset extends Component {
  handleClick = () => this.props.onClick(this.props.id);

  handleDelete = (e) => {
    const { isUsed, onDelete, id } = this.props;
    e.stopPropagation();

    onDelete(id, isUsed);
  };

  render() {
    const {
      id,
      onDelete,
      type,
      isUsed,
    } = this.props;
    const PreviewComponent = ASSET_COMPONENTS[type] || FallBackAssetComponent;

    const assetClasses = cx(
      'asset-browser-asset',
      { 'asset-browser-asset--is-used': isUsed },
    );

    return (
      <div
        onClick={this.handleClick}
        className={assetClasses}
      >
        <div className="asset-browser-asset__preview">
          <PreviewComponent id={id} />
        </div>

        { onDelete &&
          <div
            className="asset-browser-asset__delete"
            onClick={this.handleDelete}
            title={isUsed ? 'This asset is in use by the protocol and cannot be deleted' : ''}
          >
            <Icon name="delete" />
          </div>
        }
      </div>
    );
  }
}

Asset.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  isUsed: PropTypes.bool,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
};

Asset.defaultProps = {
  onClick: () => {},
  onDelete: null,
  isUsed: false,
};

export default Asset;
