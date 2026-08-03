import PropTypes from 'prop-types';

import withAssetUrl from './withAssetUrl';

const Audio = ({ url, description, ...props }) => (
  <audio src={url} {...props}>
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

export default withAssetUrl(Audio);
