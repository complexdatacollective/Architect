import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import withAssetUrl from '@components/Assets/withAssetUrl';

const ImageThumbnail = ({ url, contain, dispatch, ...props }) => {
  const className = cx(
    'thumbnail',
    'thumbnail--image',
    { 'thumbnail--contain': contain },
  );

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

export { ImageThumbnail };

export default withAssetUrl(ImageThumbnail);
