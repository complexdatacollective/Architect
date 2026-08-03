import withAssetMeta from '@components/Assets/withAssetMeta';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Icon from '@codaco/ui/lib/components/Icon';

const AudioThumbnail = ({ id, meta }) => (
  <div
    className={cx('thumbnail thumbnail--audio', {
      'thumbnail--existing': id === 'existing',
    })}
  >
    <div className="thumbnail__icon">
      <Icon name="menu-custom-interface" />
    </div>
    <div className="thumbnail__label">{meta.name}</div>
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

export default withAssetMeta(AudioThumbnail);
