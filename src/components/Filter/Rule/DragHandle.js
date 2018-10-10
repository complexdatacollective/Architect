import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { SortableHandle } from 'react-sortable-hoc';

const DragHandle = ({ className, ...props }) => (
  <span
    className={cx('rule-drag-handle', className)}
    {...props}
  >&#8597;</span>
);

DragHandle.propTypes = {
  className: PropTypes.string,
};

DragHandle.defaultProps = {
  className: null,
};

export default SortableHandle(DragHandle);
