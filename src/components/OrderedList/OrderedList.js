import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, defaultProps, renameProp, withProps } from 'recompose';
import { TransitionGroup } from 'react-transition-group';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { get } from 'lodash';
import { getCSSVariableAsNumber } from '../../utils/CSSVariables';
import WipeTransition from '../Transitions/Wipe';

const SortableItem = SortableElement(
  ({ children }) => (
    <div className="items__item">
      { children }
    </div>
  ),
);

const OrderedList = ({
  fields,
  meta: { error, dirty, submitFailed },
  item: Item,
  disabled: sortable,
  ...rest
}) => (
  <div className="list">
    { (dirty || submitFailed) && error && <p className="list__error">{error}</p> }
    <TransitionGroup className="list__items">
      { fields.map((fieldId, index) => (
        <WipeTransition key={get(fields.get(index), 'id', index)}>
          <SortableItem index={index}>
            <Item
              fieldId={fieldId}
              index={index}
              fields={fields}
              handleDelete={() => { fields.remove(index); }}
              sortable={sortable}
              {...rest}
            />
          </SortableItem>
        </WipeTransition>
      )) }
    </TransitionGroup>
  </div>
);

OrderedList.propTypes = {
  fields: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  item: PropTypes.func.isRequired,
  getId: PropTypes.func,
  disabled: PropTypes.bool.isRequired,
};

OrderedList.defaultProps = {
  getId: fieldId => fieldId,
};

export { OrderedList };

export default compose(
  defaultProps({
    lockAxis: 'y',
    useDragHandle: true,
    sortable: true,
  }),
  renameProp('sortable', 'disabled'),
  withHandlers({
    onSortEnd: props => ({ oldIndex, newIndex }) => props.fields.move(oldIndex, newIndex),
  }),
  withProps(() => ({
    transitionDuration: getCSSVariableAsNumber('--animation-duration-standard-ms'),
  })),
  SortableContainer,
)(OrderedList);
