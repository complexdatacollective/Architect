import React from 'react';
import PropTypes from 'prop-types';
import { compose, defaultProps, renameProps } from 'recompose';
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
  item: Item,
  onDelete,
  disabled: sortable, // Maybe better to rename this back in compose()?
  ...rest
}) => (
  <TransitionGroup className="items">
    {items.map(
      ({ _index, ...item }) => (
        <WipeTransition key={_index}>
          <SortableItem index={_index}>
            <Item
              {...rest}
              item={item}
              index={_index}
              key={_index}
              sortable={sortable}
              onDelete={() => onDelete(_index)}
            />
          </SortableItem>
        </WipeTransition>
      ),
    )}
  </TransitionGroup>
);

Items.propTypes = {
  items: PropTypes.array.isRequired,
  item: PropTypes.node.isRequired,
  onDelete: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export { Items };

export default compose(
  defaultProps({
    lockAxis: 'y',
    useDragHandle: true,
    transitionDuration: getCSSVariableAsNumber('--animation-duration-standard-ms'),
    sortable: true,
  }),
  renameProps({ // rename for sortable-hoc
    onSort: 'onSortEnd',
    sortable: 'disabled',
  }),
  SortableContainer,

)(Items);
