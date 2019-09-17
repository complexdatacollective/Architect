import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '../../ui/components/Icon';
import withAssetMeta from './withAssetMeta';

const Audio = ({ id, meta }) => (
  <div className={cx('assets assets-audio', { 'assets-audio--existing': id === 'existing' })}>
    <div className="assets-audio__icon"><Icon name="menu-custom-interface" /></div>
    <div className="assets-audio__label">
      {meta.name}
    </div>
  </div>
);

Audio.propTypes = {
  id: PropTypes.string.isRequired,
  meta: PropTypes.object,
};

Audio.defaultProps = {
  meta: {
    name: '',
  },
};

export { Audio };

export default withAssetMeta(Audio);
