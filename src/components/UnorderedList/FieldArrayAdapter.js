import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import UnorderedList from '.';

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
  handleDelete: props => (index) => {
    props.fields.remove(index);
  },
});

const FieldArrayAdapter = ({
  fields: { name },
  meta: { error, dirty, submitFailed },
  items,
  handleDelete,
  ...rest
}) => (
  <UnorderedList
    items={items}
    onDelete={handleDelete}
    name={name}
    {...rest}
  >
    { (dirty || submitFailed) && error && <p className="list__error">{error}</p> }
  </UnorderedList>
);

FieldArrayAdapter.propTypes = {
  form: PropTypes.string.isRequired,
  items: PropTypes.array,
  fields: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
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
