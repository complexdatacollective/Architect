import React from 'react';
import { motion } from 'framer-motion';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Handle from './Handle';
import DeleteButton from './DeleteButton';

const Item = ({ children, onDelete, onClick, className, sortable, ...rest }) => {
  const motionProps = {
    // initial: { boxShadow: '0 0.4rem 0 0 rgba(17, 21, 27, 0.664)' },
    whileHover: onClick ? {
      y: '-0.2rem',
      // boxShadow: '0 0.8rem 0.4rem 0 rgba(0, 0, 0, 0.35)',
    } : {},
    whileTap: onClick ? { y: '0.2rem' } : {},
  };

  return (
    <motion.div {...motionProps} className={cx('list-item', { 'list-item--clickable': onClick }, className)} {...rest} >
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
    </motion.div>
  );
};

Item.propTypes = {
  className: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  children: PropTypes.node,
  sortable: PropTypes.bool,
  onClick: PropTypes.func,
};

Item.defaultProps = {
  className: null,
  children: null,
  sortable: true,
  onClick: null,
};

export { Item };

export default Item;
