import React from 'react';
import PropTypes from 'prop-types';
import * as Assets from '../Assets';

// TODO: we need a component for this?
// eslint-disable-next-line
const NetworkAsset = ({ url }) => (
  <div>{url}</div>
);

const FallBackAssetComponent = () => (
  <div>No suitable component found.</div>
);

const ASSET_COMPONENTS = {
  image: Assets.Image,
  video: Assets.Video,
  audio: Assets.Audio,
  network: NetworkAsset,
};

const Asset = ({
  id,
  name,
  onClick,
  type,
}) => {
  const PreviewComponent = ASSET_COMPONENTS[type] || FallBackAssetComponent;

  return (
    <div
      onClick={() => onClick(id)}
      className="asset-browser__asset"
    >
      <div className="asset-browser__asset-preview">
        <PreviewComponent id={id} />
      </div>
      <div className="asset-browser__asset-name">{name}</div>
    </div>
  );
};

Asset.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

Asset.defaultProps = {
  onClick: () => {},
};

export default Asset;
