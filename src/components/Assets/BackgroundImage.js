import React from 'react';
import PropTypes from 'prop-types';
import injectProtocolUrl from './injectProtocolUrl';

const backgroundStyles = url => ({
  backgroundImage: `url(${url})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
});

const BackgroundImage = ({ url, ...props }) =>
  <div style={backgroundStyles(url)} {...props} />;

BackgroundImage.propTypes = {
  url: PropTypes.string.isRequired,
};

export { BackgroundImage };

export default injectProtocolUrl(BackgroundImage);
