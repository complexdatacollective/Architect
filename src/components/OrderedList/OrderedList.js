import React from 'react';
import PropTypes from 'prop-types';
import {
  compose,
  withHandlers,
  defaultProps,
  renameProp,
} from 'recompose';
import { isPlainObject } from 'lodash';
import { SortableContainer } from 'react-sortable-hoc';
import ListItem from './ListItem';

const OrderedList = ({
  fields,
  meta: { error, dirty, submitFailed },
  item: Item,
  disabled: sortable,
  onClickItem,
  form,
}) => (
  <div className="list">
    { (dirty || submitFailed) && error && <p className="list__error">{error}</p> }
    { fields.map((fieldId, index) => {
      const value = fields.get(index);
      const previewValue = isPlainObject(value) ? value : { value };
      const onClick = onClickItem && (
        () => onClickItem(fieldId)
      );

      return (
        <ListItem
          index={index}
          sortable={sortable}
          key={fieldId}
          layoutId={onClickItem && fieldId}
          onClick={onClick}
          onDelete={() => fields.remove(index)}
        >
          <Item
            {...previewValue} // eslint-disable-line react/jsx-props-no-spreading
            fieldId={fieldId}
            form={form}
          />
        </ListItem>
      );
    }) }
  </div>
);

OrderedList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.object.isRequired,
  form: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  meta: PropTypes.object.isRequired,
  item: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
  onClickItem: PropTypes.func,
  disabled: PropTypes.bool.isRequired,
};

OrderedList.defaultProps = {
  onClickItem: null,
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
    onSortEnd: ({ fields }) => ({ oldIndex, newIndex }) => fields.move(oldIndex, newIndex),
  }),
  SortableContainer,
)(OrderedList);
