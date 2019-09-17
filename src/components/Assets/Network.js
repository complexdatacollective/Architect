import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '../../ui/components/Icon';
import withAssetMeta from './withAssetMeta';

const Network = ({ id, meta }) => (
  <div className={cx('assets assets-network', { 'assets-network--existing': id === 'existing' })}>
    <div className="assets-network__icon"><Icon name="menu-sociogram" /></div>
    <div className="assets-network__label">
      {meta.name}
    </div>
  </div>
);

Network.propTypes = {
  id: PropTypes.string.isRequired,
  meta: PropTypes.object,
};

Network.defaultProps = {
  meta: {
    name: '',
  },
};

export { Network };

export default withAssetMeta(Network);
