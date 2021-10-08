import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';
import { Icon } from '@codaco/ui';
import Handle from './Handle';

const interactionVariants = {
  whileHover: {
    y: '-0.2rem',
    // boxShadow: '0 0.8rem 0.4rem 0 rgba(0, 0, 0, 0.35)',
  },
  whileTap: { y: '0.2rem' },
};

const ListItem = ({
  children,
  onDelete,
  onClick,
  className,
  sortable,
  layoutId,
}) => {
  const {
    whileHover,
    whileTap,
  } = useMemo(() => ({
    whileHover: onClick && interactionVariants.whileHover,
    whileTap: onClick && interactionVariants.whileTap,
  }), [onClick]);

  const componentClasses = cx(
    'list-item',
    { 'list-item--clickable': onClick },
    className,
  );

  return (
    <div className={componentClasses}>
      <motion.div
        whileHover={whileHover}
        whileTap={whileTap}
        layoutId={layoutId}
        className="list-item__container"
        key="container"
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
