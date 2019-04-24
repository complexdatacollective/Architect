import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../ui/components/Icon';
import * as Assets from '../Assets';

const FallBackAssetComponent = () => (
  <div>No suitable component found.</div>
);

const ASSET_COMPONENTS = {
  image: Assets.Image,
  video: Assets.Video,
  audio: Assets.Audio,
  network: Assets.Network,
};

const Asset = ({
  id,
  onClick,
  onDelete,
  type,
}) => {
  const PreviewComponent = ASSET_COMPONENTS[type] || FallBackAssetComponent;

  const handleClick = () => onClick(id);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div
      onClick={handleClick}
      className="asset-browser-asset"
    >
      <div className="asset-browser-asset__preview">
        <PreviewComponent id={id} />
      </div>

      { onDelete &&
        <div
          className="asset-browser-asset__delete"
          onClick={handleDelete}
        >
          <Icon name="delete" />
        </div>
      }
    </div>
  );
};

Asset.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
};

Asset.defaultProps = {
  onClick: () => {},
  onDelete: null,
};

export default Asset;
