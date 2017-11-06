import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { SortableHandle } from 'react-sortable-hoc';

const SelectorDragHandle = ({ className, ...props }) => (
  <span
    className={cx('selector-drag-handle', className)}
    {...props}
  >
    ::
  </span>
);

SelectorDragHandle.propTypes = {
  className: PropTypes.string,
};

SelectorDragHandle.defaultProps = {
  className: null,
};

export default SortableHandle(SelectorDragHandle);
