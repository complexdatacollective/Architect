import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import Button from '../../ui/components/Button';

const stopPropagation = f =>
  (e, ...rest) => {
    e.stopPropagation();
    f(e, ...rest);
  };

const PromptForm = ({
  children,
  handleSubmit,
  onCancel,
}) => (

  <form onSubmit={stopPropagation(handleSubmit)}>
    <div>
      {children}
    </div>
    <div>
      <Button type="submit">Submit</Button>
      <Button onClick={onCancel} color="platinum">Cancel</Button>
    </div>
  </form>
);

PromptForm.propTypes = {
  children: PropTypes.node,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

PromptForm.defaultProps = {
  children: null,
};

export default reduxForm({ form: 'prompt-form' })(PromptForm);
