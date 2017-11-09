import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { SortableHandle } from 'react-sortable-hoc';

const RuleDragHandle = ({ className, ...props }) => (
  <span
    className={cx('rule-drag-handle', className)}
    {...props}
  >&#8597;</span>
);

RuleDragHandle.propTypes = {
  className: PropTypes.string,
};

RuleDragHandle.defaultProps = {
  className: null,
};

export default SortableHandle(RuleDragHandle);
