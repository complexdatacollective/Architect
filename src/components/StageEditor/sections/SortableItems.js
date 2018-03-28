import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, defaultProps } from 'recompose';
import { SortableContainer } from 'react-sortable-hoc';
import SortableItem from './SortableItem';

const SortableItems = ({ fields, itemComponent: ItemComponent, ...rest }) => (
  <div className="sortable-items">
    { fields.map((fieldId, index) => (
      <SortableItem remove={() => fields.remove(index)} key={fieldId} index={index}>
        <ItemComponent fieldId={fieldId} index={index} fields={fields} {...rest} />
      </SortableItem>
    )) }
  </div>
);

SortableItems.propTypes = {
  fields: PropTypes.object.isRequired,
  itemComponent: PropTypes.func.isRequired,
};

export { SortableItems };

export default compose(
  defaultProps({ lockAxis: 'y', useDragHandle: true }),
  withHandlers({
    onSortEnd: props => ({ oldIndex, newIndex }) => props.fields.move(oldIndex, newIndex),
  }),
  SortableContainer,
)(SortableItems);
