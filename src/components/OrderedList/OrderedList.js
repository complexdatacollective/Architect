import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  compose,
  withHandlers,
  defaultProps,
  renameProp,
} from 'recompose';
import { isPlainObject, isEqual } from 'lodash';
import { SortableContainer } from 'react-sortable-hoc';
import ListItem from './ListItem';

class OrderedList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps.input.value, this.props.input.value);
  }

  render() {
    const {
      input: { value: values, name },
      meta: { error, dirty, submitFailed },
      item: Item,
      disabled: sortable,
      onClickItem,
      meta: { form },
    } = this.props;

    return (
      <div className="list">
        { (dirty || submitFailed) && error && <p className="list__error">{error}</p> }
        { values.map((value, index) => {
          const fieldId = `${name}[${index}]`;
          const previewValue = isPlainObject(value) ? value : { value };
          const onClick = onClickItem && (
            () => onClickItem(fieldId)
          );
          const onDelete = () => {}; // () => fields.remove(index);

          return (
            <ListItem
              index={index}
              sortable={sortable}
              key={fieldId}
              layoutId={onClickItem && fieldId}
              onClick={onClick}
              onDelete={onDelete}
            >
              <Item
                {...previewValue} // eslint-disable-line react/jsx-props-no-spreading
                fieldId={fieldId}
                form={form}
                key={fieldId}
              />
            </ListItem>
          );
        }) }
      </div>
    );
  }
}

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
