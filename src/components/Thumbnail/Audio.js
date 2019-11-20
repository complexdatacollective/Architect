import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '@ui/components/Icon';
import withAssetMeta from '@components/Assets/withAssetMeta';

const AudioThumbnail = ({ id, meta }) => (
  <div className={cx('thumbnail thumbnail--audio', { 'thumbnail--existing': id === 'existing' })}>
    <div className="thumbnail__icon"><Icon name="menu-custom-interface" /></div>
    <div className="thumbnail__label">
      {meta.name}
    </div>
  </div>
);

AudioThumbnail.propTypes = {
  id: PropTypes.string.isRequired,
  meta: PropTypes.object,
};

AudioThumbnail.defaultProps = {
  meta: {
    name: '',
  },
};

export {
  AudioThumbnail,
};

export default withAssetMeta(AudioThumbnail);
