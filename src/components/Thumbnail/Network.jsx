import withAssetMeta from '@components/Assets/withAssetMeta';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Icon from '@codaco/ui/lib/components/Icon';

const NetworkThumbnail = ({ id, meta }) => (
  <div
    className={cx('thumbnail thumbnail--network', {
      'thumbnail--existing': id === 'existing',
    })}
  >
    <div className="thumbnail__icon">
      <Icon name="menu-sociogram" />
    </div>
    <div className="thumbnail__label">{meta.name}</div>
  </div>
);

NetworkThumbnail.propTypes = {
  id: PropTypes.string.isRequired,
  meta: PropTypes.object,
};

NetworkThumbnail.defaultProps = {
  meta: {
    name: '',
  },
};

export default withAssetMeta(NetworkThumbnail);
