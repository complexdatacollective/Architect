import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, defaultProps, renameProp } from 'recompose';
import { TransitionGroup } from 'react-transition-group';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import WipeTransition from '../Transitions/Wipe';
import { getCSSVariableAsNumber } from '../../utils/CSSVariables';

const SortableItem = SortableElement(
  ({ children }) => (
    <div className="items__item">
      { children }
    </div>
  ),
);

const Items = ({
  items,
  component: Component,
  ...rest
}) => (
  <TransitionGroup className="list__items">
    {items.map(
      ({ _index, ...item }) => (
        <WipeTransition key={_index}>
          <SortableItem index={_index}>
            <Component
              {...rest}
              item={item}
              index={_index}
              key={_index}
            />
          </SortableItem>
        </WipeTransition>
      ),
    )}
  </TransitionGroup>
);

Items.propTypes = {
  items: PropTypes.array.isRequired,
  component: PropTypes.node.isRequired,
};

export { Items };

export default compose(
  defaultProps({
    lockAxis: 'y',
    useDragHandle: true,
    transitionDuration: getCSSVariableAsNumber('--animation-duration-standard-ms'),
    sortable: true,
  }),
  renameProp('sortable', 'disabled'),
  withHandlers({
    onSortEnd: () => () => {},
    // onSortEnd: props => ({ oldIndex, newIndex }) => {
    //   props.fields.move(oldIndex, newIndex)
    // },
  }),
  SortableContainer,
)(Items);
