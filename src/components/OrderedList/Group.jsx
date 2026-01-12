import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const Group = ({ children }) => (
  <div className={cx('list-group')}>
    {children}
  </div>
);

Group.propTypes = {
  children: PropTypes.node,
};

Group.defaultProps = {
  children: null,
};

export default Group;
