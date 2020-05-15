import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import stopPropagationFromHandler from '@app/utils/stopPropagationFromHandler';

const formOptions = {
  touchOnBlur: false,
  touchOnChange: true,
};

/**
 * This is for redux-form
 * Would like to wrap this component up into InlineEditScreen if possible
 */
const Form = ({ handleSubmit, children }) => (
  <form onSubmit={stopPropagationFromHandler(handleSubmit)}>
    {children}
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  children: PropTypes.node,
};

Form.defaultProps = {
  children: null,
};

export default reduxForm(formOptions)(Form);
