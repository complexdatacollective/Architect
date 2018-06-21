import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Handle from './Handle';
import DeleteButton from './DeleteButton';

const Item = ({ children, handleDelete, className }) => (
  <div className={cx('stage-editor-sortable-item', className)}>
    <div className="stage-editor-sortable-item__control stage-editor-sortable-item__control--left">
      <Handle />
    </div>
    <div className="stage-editor-sortable-item__content">
      {children}
    </div>
    <div className="stage-editor-sortable-item__control stage-editor-sortable-item__control--right">
      <DeleteButton onClick={handleDelete} />
    </div>
  </div>
);

Item.propTypes = {
  className: PropTypes.string,
  handleDelete: PropTypes.func.isRequired,
  children: PropTypes.node,
};

Item.defaultProps = {
  className: null,
  children: null,
};

export { Item };

export default Item;
