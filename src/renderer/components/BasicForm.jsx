import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, submit } from 'redux-form';
import { compose } from 'redux';

const BasicForm = ({
  children,
  form,
  submit: submitForm,
}) => {
  // Custom submit handler to prevent propagation to any parent redux-form forms.
  const onSubmit = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    submitForm(form);
  }, [form]);

  return (
    <form onSubmit={onSubmit}>
      {children}
    </form>
  );
};

BasicForm.propTypes = {
  children: PropTypes.node.isRequired,
  form: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired,
};

BasicForm.defaultProps = {
};

export default compose(
  reduxForm(),
  connect(null, { submit }),
)(BasicForm);
