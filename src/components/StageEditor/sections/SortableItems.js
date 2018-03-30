import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, defaultProps } from 'recompose';
import { TransitionGroup } from 'react-transition-group';
import { SortableContainer } from 'react-sortable-hoc';
import FolderTransition from '../../FolderTransition';
import SortableItem from './SortableItem';

const SortableItems = ({ fields, itemComponent: ItemComponent, ...rest }) => (
  <TransitionGroup className="sortable-items">
    { fields.map((fieldId, index) => (
      <FolderTransition key={fieldId} exit={false}>
        <SortableItem remove={() => fields.remove(index)} index={index}>
          <ItemComponent fieldId={fieldId} index={index} fields={fields} {...rest} />
        </SortableItem>
      </FolderTransition>
    )) }
  </TransitionGroup>
);

SortableItems.propTypes = {
  fields: PropTypes.object.isRequired,
  itemComponent: PropTypes.func.isRequired,
};

export { SortableItems };

export default compose(
  defaultProps({ lockAxis: 'y', useDragHandle: true, transitionDuration: 10000 }),
  withHandlers({
    onSortEnd: props => ({ oldIndex, newIndex }) => props.fields.move(oldIndex, newIndex),
  }),
  SortableContainer,
)(SortableItems);
