import React from 'react';
import PropTypes from 'prop-types';
import withAssetUrl from './withAssetUrl';

const Image = ({ url, alt, ...props }) => (
  <img
    src={url}
    alt={alt}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
);

Image.propTypes = {
  alt: PropTypes.string,
  url: PropTypes.string.isRequired,
};

Image.defaultProps = {
  alt: '',
};

export { Image };

export default withAssetUrl(Image);
