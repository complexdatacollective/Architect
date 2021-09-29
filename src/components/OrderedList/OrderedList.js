import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  compose,
  withHandlers,
  defaultProps,
  renameProp,
} from 'recompose';
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
  form,
  ...rest
}) => {

  const onDelete = useCallback((index) => {
    fields.remove(index);
  }, []);

  return (
    <div className="list">
      { (dirty || submitFailed) && error && <p className="list__error">{error}</p> }
      { fields.map((fieldId, index) => (
        <div className="items__item" key={fieldId}>
          <Item
            fieldId={fieldId}
            // index={index}
            // fields={fields}
            // onDelete={onDelete}
            // sortable={sortable}
            form={form}
            // eslint-disable-next-line react/jsx-props-no-spreading
            // {...rest}
          />
        </div>
      )) }
    </div>
  );
};

OrderedList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.object.isRequired,
  form: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  meta: PropTypes.object.isRequired,
  item: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
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
    onSortEnd: (props) => ({ oldIndex, newIndex }) => props.fields.move(oldIndex, newIndex),
  }),
  // SortableContainer,
)(OrderedList);
