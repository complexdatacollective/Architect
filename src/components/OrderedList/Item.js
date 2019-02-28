import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Handle from './Handle';
import DeleteButton from './DeleteButton';

const Item = ({ children, onDelete, onClick, className, sortable, ...rest }) => (
  <div className={cx('list-item', className)} {...rest} >
    { sortable &&
      <div className="list-item__control list-item__control--left">
        <Handle />
      </div>
    }
    <div className="list-item__content" onClick={onClick}>
      {children}
    </div>
    <div className="list-item__control list-item__control--right">
      <DeleteButton onClick={onDelete} />
    </div>
  </div>
);

Item.propTypes = {
  className: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
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
