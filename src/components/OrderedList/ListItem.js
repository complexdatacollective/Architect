import React from 'react';
import { motion } from 'framer-motion';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';
import { Icon } from '@codaco/ui';
import Handle from './Handle';

const ListItem = ({
  children,
  onDelete,
  onClick,
  className,
  sortable,
  layoutId,
}) => {
  const componentClasses = cx(
    'list-item',
    { 'list-item--clickable': onClick },
    className,
  );

  console.log(layoutId);

  return (
    <div className={componentClasses}>
      <motion.div
        layoutId={layoutId}
        className="list-item__container"
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
          <div
            className="list-delete-button"
            onClick={onDelete}
          >
            <Icon name="delete" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

ListItem.propTypes = {
  className: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  children: PropTypes.node,
  sortable: PropTypes.bool,
  onClick: PropTypes.func,
  layoutId: PropTypes.string,
};

ListItem.defaultProps = {
  className: null,
  children: null,
  sortable: true,
  onClick: null,
  layoutId: null,
};

export default SortableElement(ListItem);
