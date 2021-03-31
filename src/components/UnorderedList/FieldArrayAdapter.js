import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import UnorderedList from './UnorderedList';

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
  handleDelete: ({ fields }) => (index) => fields.remove(index),
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
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
  >
    { (dirty || submitFailed) && error && <p className="list__error">{error}</p> }
  </UnorderedList>
);

FieldArrayAdapter.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  items: PropTypes.array,
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  meta: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

FieldArrayAdapter.defaultProps = {
  items: [],
};

const mapStateToProps = (state, { form, fields }) => {
  if (!fields || !form) { return {}; }

  const items = formValueSelector(form)(state, fields.name)
    .map((item, index) => ({ ...item, index, fieldId: `${fields.name}[${index}]` }));

  return ({
    items,
  });
};

export { FieldArrayAdapter };

export default compose(
  connect(mapStateToProps),
  fieldHandlers,
)(FieldArrayAdapter);
