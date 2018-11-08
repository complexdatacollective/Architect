import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import List from '.';

/**
 * Usage:
 *
 * <FieldArray
 *   form={form}
 *   name={name}
 *   component={Items}
 *   item={Variable}
 *   sortable={false}
 * />
 */

const fieldHandlers = withHandlers({
  handleSort: props => ({ oldIndex, newIndex }) => {
    props.fields.move(oldIndex, newIndex);
  },
  handleDelete: props => (index) => {
    props.fields.remove(index);
  },
});

const FieldArrayAdapter = ({
  fields: { name },
  meta: { error, dirty, submitFailed },
  items,
  handleSort,
  handleDelete,
  ...rest
}) => (
  <List
    items={items}
    onSort={handleSort}
    onDelete={handleDelete}
    name={name}
    {...rest}
  >
    { (dirty || submitFailed) && error && <p className="items__error">{error}</p> }
  </List>
);

FieldArrayAdapter.propTypes = {
  form: PropTypes.string.isRequired,
  items: PropTypes.array,
  fields: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  handleSort: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

FieldArrayAdapter.defaultProps = {
  items: [],
};

const mapStateToProps = (state, { form, fields: { name } }) => {
  const items = formValueSelector(form)(state, name);

  return ({
    items,
  });
};

export { FieldArrayAdapter };

export default compose(
  connect(mapStateToProps),
  fieldHandlers,
)(FieldArrayAdapter);
