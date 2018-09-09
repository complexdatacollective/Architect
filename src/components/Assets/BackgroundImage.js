import React from 'react';
import PropTypes from 'prop-types';
import injectProtocolUrl from './injectProtocolUrl';

const BackgroundImage = ({ url, ...props }) =>
  <div style={{ backgroundImage: `url(${url})` }} {...props} />;

BackgroundImage.propTypes = {
  url: PropTypes.string.isRequired,
};

export { BackgroundImage };

export default injectProtocolUrl(BackgroundImage);
