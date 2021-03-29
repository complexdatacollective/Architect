import React from 'react';
import PropTypes from 'prop-types';
import withAssetUrl from './withAssetUrl';

const backgroundStyles = (url) => ({
  backgroundImage: `url(${url})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
});

const BackgroundImage = ({ url, ...props }) => (
  <div
    style={backgroundStyles(url)}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
);

BackgroundImage.propTypes = {
  url: PropTypes.string.isRequired,
};

export { BackgroundImage };

export default withAssetUrl(BackgroundImage);
