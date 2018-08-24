import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, defaultProps } from 'recompose';
import { TransitionGroup } from 'react-transition-group';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { get } from 'lodash';
import { getCSSVariableAsNumber } from '../../../utils/CSSVariables';
import WipeTransition from '../../Transitions/Wipe';

const SortableItem = SortableElement(
  ({ children }) => (
    <div className="stage-editor-sortable-items__item">
      { children }
    </div>
  ),
);

const Items = ({ fields, meta: { error, dirty }, itemComponent: ItemComponent, ...rest }) => (
  <div className="stage-editor-sortable-items">
    { dirty && error && <p className="stage-editor-sortable-items__error">{error}</p> }
    <TransitionGroup className="stage-editor-sortable-items__items">
      { fields.map((fieldId, index) => (
        <WipeTransition key={get(fields.get(index), 'id', index)}>
          <SortableItem index={index}>
            <ItemComponent
              fieldId={fieldId}
              index={index}
              fields={fields}
              handleDelete={() => { fields.remove(index); }}
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
  }),
  withHandlers({
    onSortEnd: props => ({ oldIndex, newIndex }) => props.fields.move(oldIndex, newIndex),
  }),
  SortableContainer,
)(Items);
