import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, defaultProps, renameProp } from 'recompose';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

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
    { fields.map((fieldId, index) => (
      <SortableItem index={index} key={index}>
        <Item
          fieldId={fieldId}
          index={index}
          fields={fields}
          handleDelete={() => { fields.remove(index); }}
          sortable={sortable}
          {...rest}
        />
      </SortableItem>
    )) }
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
  SortableContainer,
)(OrderedList);
