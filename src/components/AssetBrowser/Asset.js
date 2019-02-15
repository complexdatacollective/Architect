import React from 'react';
import PropTypes from 'prop-types';
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
  type,
}) => {
  const PreviewComponent = ASSET_COMPONENTS[type] || FallBackAssetComponent;

  return (
    <div
      onClick={() => onClick(id)}
      className="asset-browser-asset"
    >
      <div className="asset-browser-asset__preview">
        <PreviewComponent id={id} />
      </div>
    </div>
  );
};

Asset.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

Asset.defaultProps = {
  onClick: () => {},
};

export default Asset;
