/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';
import withAssetUrl from './withAssetUrl';

const Video = ({ url, description, ...props }) => (
  <video
    src={url}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    playsInline
  >
    {description}
  </video>
);

Video.propTypes = {
  description: PropTypes.string,
  url: PropTypes.string.isRequired,
};

Video.defaultProps = {
  description: '',
};

export { Video };

export default withAssetUrl(Video);
