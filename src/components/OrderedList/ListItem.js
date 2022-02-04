import React from 'react';
import { motion } from 'framer-motion';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';
import Handle from './Handle';
import DeleteButton from './DeleteButton';

const ListItem = ({
  children,
  onDelete,
  onClick,
  className,
  sortable,
}) => {
  const componentClasses = cx(
    'list-item',
    { 'list-item--clickable': onClick },
    className,
  );

  return (
    <motion.div
      className={componentClasses}
    >
      { sortable
        && (
        <div className="list-item__control list-item__control--left" key="handle">
          <Handle />
        </div>
        )}
      <div className="list-item__content" onClick={onClick} key="content">
        {children}
      </div>
      <div className="list-item__control list-item__control--right" key="controls">
        <DeleteButton onDelete={onDelete} />
      </div>
    </motion.div>
  );
};

ListItem.propTypes = {
  className: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  children: PropTypes.node,
  sortable: PropTypes.bool,
  onClick: PropTypes.func,
};

ListItem.defaultProps = {
  className: null,
  children: null,
  sortable: true,
  onClick: null,
};

export default SortableElement(ListItem);
