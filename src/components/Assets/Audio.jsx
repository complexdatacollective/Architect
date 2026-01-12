/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';
import withAssetUrl from './withAssetUrl';

const Audio = ({ url, description, ...props }) => (
  <audio
    src={url}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    {description}
  </audio>
);

Audio.propTypes = {
  description: PropTypes.string,
  url: PropTypes.string.isRequired,
};

Audio.defaultProps = {
  description: '',
};

export { Audio };

export default withAssetUrl(Audio);
