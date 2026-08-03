import PropTypes from 'prop-types';

import withAssetUrl from './withAssetUrl';

const Video = ({ url, description, ...props }) => (
  <video src={url} {...props} playsInline>
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

export default withAssetUrl(Video);
