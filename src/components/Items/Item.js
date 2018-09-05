import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Handle from './Handle';
import DeleteButton from './DeleteButton';

const Item = ({ children, handleDelete, className, sortable }) => (
  <div className={cx('items-item', className)}>
    { sortable &&
      <div className="items-item__control items-item__control--left">
        <Handle />
      </div>
    }
    <div className="items-item__content">
      {children}
    </div>
    <div className="items-item__control items-item__control--right">
      <DeleteButton onClick={handleDelete} />
    </div>
  </div>
);

Item.propTypes = {
  className: PropTypes.string,
  handleDelete: PropTypes.func.isRequired,
  children: PropTypes.node,
  sortable: PropTypes.bool,
};

Item.defaultProps = {
  className: null,
  children: null,
  sortable: true,
};

export { Item };

export default Item;
