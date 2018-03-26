/* eslint-disable */

import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { Icon } from 'network-canvas-ui';
import SortableItem from './SortableItem';
import { SortableContainer } from 'react-sortable-hoc';

const SortableItems = ({ fields, itemComponent: ItemComponent, ...rest }) => (
  <div className="sortable-items">
    { fields.map((fieldId, index) => (
      <SortableItem remove={() => fields.remove(index)} index={index}>
        <ItemComponent fieldId={fieldId} index={index} fields={fields} {...rest} />
      </SortableItem>
    )) }
    <button type="button" onClick={() => fields.push({})}>+</button>
  </div>
);

export { SortableItems };

export default compose(
  withHandlers({
    onSortEnd: props => ({ oldIndex, newIndex }) => props.fields.move(oldIndex, newIndex),
  }),
  SortableContainer,
)(SortableItems);
