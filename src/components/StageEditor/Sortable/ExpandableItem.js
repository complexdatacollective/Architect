import React from 'react';
import cx from 'classnames';
import ExpandableItem from '../../Items/ExpandableItem';
import { Icon } from '../../../ui/components';
import Handle from './Handle';
import DeleteButton from './DeleteButton';

class SortableExpandableItem extends ExpandableItem {
  render() {
    const { preview, children, handleDelete } = this.props;

    const componentClasses = cx(
      'items-expandable-item',
      { 'items-expandable-item--open': this.state.isOpen },
      { 'items-expandable-item--lock': this.props.lockOpen },
      this.props.className,
    );

    return (
      <div className={componentClasses}>
        <div className="items-expandable-item__preview">
          <div
            className="items-expandable-item__control items-expandable-item__control--left"
          >
            <Handle />
          </div>
          <div className="items-expandable-item__preview-content">
            {preview}
          </div>
          <div
            className="items-expandable-item__control items-expandable-item__control--right"
          >
            <DeleteButton onClick={handleDelete} />
          </div>
        </div>
        <div
          className="items-expandable-item__expand"
          onClick={this.handleToggleOpen}
        >
          <Icon
            name="chevron-down"
            color="white"
            className="items-expandable-item__expand--open"
          />
          <Icon
            name="chevron-up"
            color="white"
            className="items-expandable-item__expand--close"
          />
        </div>
        <div className="items-expandable-item__content">
          {children}
        </div>
      </div>
    );
  }
}

export { SortableExpandableItem };

export default SortableExpandableItem;
