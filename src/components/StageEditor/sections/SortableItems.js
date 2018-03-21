import React from 'react';
import { compose, withHandlers, defaultProps } from 'recompose';
import PropTypes from 'prop-types';
import { SortableContainer, arrayMove } from 'react-sortable-hoc';

const itemHandlers = withHandlers({
  onSortEnd: props => ({ oldIndex, newIndex }) => {
    const reorderedContentItems = arrayMove(props.items, oldIndex, newIndex);

    props.onChange(reorderedContentItems);
  },
  updateItem: props => (newItem, index) => {
    const items = props.items
      .map((item, i) => {
        if (i !== index) { return item; }
        return { ...item, ...newItem };
      });

    props.onChange(items);
  },
  deleteItem: props => (index) => {
    const items = props.items
      .filter((_, i) => i !== index);

    props.onChange(items);
  },
});

const SortableItems = ({ items, updateItem, deleteItem, component: Component, ...otherProps }) => (
  <div className="sortable-items">
    { items.map(
      (props, index) => (
        <Component
          {...props}
          {...otherProps}
          index={index}
          key={index}
          onChange={item => updateItem(item, index)}
          onDelete={() => deleteItem(index)}
        />
      ),
    ) }
  </div>
);

SortableItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  updateItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  component: PropTypes.func.isRequired,
};

SortableItems.defaultProps = {
  items: [],
};

export default compose(
  defaultProps({ lockAxis: 'y', useDragHandle: true }),
  itemHandlers,
  SortableContainer,
)(SortableItems);
