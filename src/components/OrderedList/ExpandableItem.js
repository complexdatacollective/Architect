import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from '@codaco/ui';
import Handle from './Handle';
import DeleteButton from './DeleteButton';

const ExpandableItem = ({
  sortable,
  preview,
  children,
  handleDelete,
  open,
  lockOpen,
  className,
}) => {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const nextIsOpen = open || lockOpen;
    setOpen(nextIsOpen);
  }, []);

  useEffect(() => {
    setOpen(open);
  }, [open]);

  const handleToggleOpen = () => {
    if (lockOpen) { return; }
    setOpen((o) => !o);
  };

  const isOpenOrForcedOpen = isOpen || lockOpen;

  const componentClasses = cx(
    'list-expandable-item',
    { 'list-expandable-item--open': isOpenOrForcedOpen },
    { 'list-expandable-item--lock': lockOpen },
    className,
  );

  return (
    <div className={componentClasses}>
      <div className="list-expandable-item__preview">
        { sortable
          && (
          <div
            className="list-expandable-item__control list-expandable-item__control--left"
          >
            <Handle />
          </div>
          )}
        <div className="list-expandable-item__preview-content">
          {preview}
        </div>
        <div
          className="list-expandable-item__control list-expandable-item__control--right"
        >
          <DeleteButton onClick={handleDelete} />
        </div>
      </div>
      <div
        className="list-expandable-item__expand"
        onClick={handleToggleOpen}
      >
        <Icon
          name="chevron-down"
          color="white"
          className="list-expandable-item__expand--open"
        />
        <Icon
          name="chevron-up"
          color="white"
          className="list-expandable-item__expand--close"
        />
      </div>
      <div className="list-expandable-item__content">
        {children}
      </div>
    </div>
  );
};

ExpandableItem.propTypes = {
  className: PropTypes.string,
  open: PropTypes.bool,
  sortable: PropTypes.bool,
  lockOpen: PropTypes.bool,
  handleDelete: PropTypes.func.isRequired,
  preview: PropTypes.node,
  children: PropTypes.node,
};

ExpandableItem.defaultProps = {
  className: null,
  sortable: true,
  open: false,
  lockOpen: false,
  preview: null,
  children: null,
};

export { ExpandableItem };

export default ExpandableItem;
