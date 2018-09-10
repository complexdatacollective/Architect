import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, defaultProps, renameProp } from 'recompose';
import { TransitionGroup } from 'react-transition-group';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { get } from 'lodash';
import { getCSSVariableAsNumber } from '../../../../utils/CSSVariables';
import WipeTransition from '../../../Transitions/Wipe';

const SortableItem = SortableElement(
  ({ children }) => (
    <div className="content-grid-items__item">
      { children }
    </div>
  ),
);

const Items = ({
  fields,
  itemComponent: ItemComponent,
  disabled: sortable,
  ...rest
}) => (
  <div className="content-grid-items">
    <TransitionGroup className="content-grid-items__items">
      { fields.map((fieldId, index) => (
        <WipeTransition key={get(fields.get(index), 'id', index)}>
          <SortableItem index={index}>
            <ItemComponent
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

Items.propTypes = {
  fields: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  itemComponent: PropTypes.func.isRequired,
  getId: PropTypes.func,
  disabled: PropTypes.bool.isRequired,
};

Items.defaultProps = {
  getId: fieldId => fieldId,
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
    onSortEnd: props => ({ oldIndex, newIndex }) => props.fields.move(oldIndex, newIndex),
  }),
  SortableContainer,
)(Items);
