import withAssetUrl from '@components/Assets/withAssetUrl';
import cx from 'classnames';
import PropTypes from 'prop-types';

const ImageThumbnail = ({ url, contain, ...props }) => {
  const className = cx('thumbnail', 'thumbnail--image', {
    'thumbnail--contain': contain,
  });

  return (
    <div
      className={className}
      style={{ backgroundImage: `url(${url})` }}
      {...props}
    />
  );
};

ImageThumbnail.propTypes = {
  url: PropTypes.string.isRequired,
  contain: PropTypes.bool,
};

ImageThumbnail.defaultProps = {
  contain: false,
};

export default withAssetUrl(ImageThumbnail);
