import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '../../ui/components/Icon';
import withAssetMeta from './withAssetMeta';

const Video = ({ id, meta }) => (
  <div className={cx('assets assets-video', { 'assets-video--existing': id === 'existing' })}>
    <div className="assets-video__icon"><Icon name="menu-custom-interface" /></div>
    <div className="assets-video__label">
      {meta.name}
    </div>
  </div>
);

Video.propTypes = {
  id: PropTypes.string.isRequired,
  meta: PropTypes.object,
};

Video.defaultProps = {
  meta: {
    name: '',
  },
};

export { Video };

export default withAssetMeta(Video);
