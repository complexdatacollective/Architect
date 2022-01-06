import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  compose,
  defaultProps,
  renameProp,
} from 'recompose';
import { isPlainObject, isArray } from 'lodash';
import { connect } from 'react-redux';
import { arrayMove, arrayRemove } from 'redux-form';
import { SortableContainer } from 'react-sortable-hoc';
import { actionCreators as dialogActions } from '@modules/dialogs';
import ListItem from './ListItem';

const OrderedList = memo((props) => {
  const {
    input: { value: values, name },
    meta: { error, dirty, submitFailed },
    item: Item,
    disabled: sortable,
    onClickItem,
    removeItem,
    meta: { form },
  } = props;

  return (
    <div className="list">
      { (dirty || submitFailed) && error && !isArray(error) && <p className="list__error">{error}</p> }
      { values && values.map((value, index) => {
        const previewValue = isPlainObject(value) ? value : { value };
        const fieldId = `${name}[${index}]`;
        const onClick = onClickItem && (
          () => onClickItem(fieldId)
        );

        const onDelete = () => removeItem(index);

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
});

OrderedList.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.arrayOf(PropTypes.object).isRequired,
    name: PropTypes.string,
  }).isRequired,
  meta: PropTypes.shape({
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    dirty: PropTypes.bool,
    submitFailed: PropTypes.bool,
    form: PropTypes.string,
  }).isRequired,
  item: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
  onClickItem: PropTypes.func,
  removeItem: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

OrderedList.defaultProps = {
  onClickItem: null,
};

const mapDispatchToProps = (dispatch, { input: { name }, meta: { form } }) => ({
  removeItem: (index) => {
    dispatch(
      dialogActions.openDialog({
        type: 'Confirm',
        title: 'Remove this item?',
        confirmLabel: 'Remove item',
      }),
    )
      .then((confirm) => {
        if (!confirm) { return; }
        dispatch(arrayRemove(form, name, index));
      });
  },
  onSortEnd: ({ oldIndex, newIndex }) => {
    dispatch(arrayMove(form, name, oldIndex, newIndex));
  },
});

export { OrderedList };

export default compose(
  defaultProps({
    lockAxis: 'y',
    useDragHandle: true,
    sortable: true,
  }),
  renameProp('sortable', 'disabled'),
  connect(null, mapDispatchToProps),
  SortableContainer,
)(OrderedList);
