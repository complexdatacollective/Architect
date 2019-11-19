import React from 'react';
import PropTypes from 'prop-types';
import withAssetUrl from '@components/Assets/withAssetUrl';

const backgroundStyles = ({ url, contain }) => ({
  backgroundImage: `url(${url})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: contain ? 'contain' : 'cover',
  backgroundPosition: 'center',
});

const ImageThumbnail = ({ url, contain, dispatch, ...props }) => (
  <div
    className="thumbnail thumbnail--image"
    style={backgroundStyles({ url, contain })}
    {...props}
  />
);

ImageThumbnail.propTypes = {
  url: PropTypes.string.isRequired,
  contain: PropTypes.boolean,
};

ImageThumbnail.defaultProps = {
  contain: false,
};

export { ImageThumbnail };

export default withAssetUrl(ImageThumbnail);
