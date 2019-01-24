import React from 'react';
import { reduxForm } from 'redux-form';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import withFormSubmitErrors from '../Form/withFormSubmitErrors';
import Button from '../../ui/components/Button';
import Issues from '../Issues';

const formOptions = {
  form: 'prompt-form',
  touchOnBlur: false,
  touchOnChange: true,
};

const stopPropagation = f =>
  (e, ...rest) => {
    e.stopPropagation();
    f(e, ...rest);
  };

const PromptForm = ({
  children,
  handleSubmit,
  submitFailed,
  issues,
  onCancel,
}) => (
  <div className="prompts-prompt-form">
    <div className="prompts-prompt-form__content">
      <form onSubmit={stopPropagation(handleSubmit)}>
        <div className="prompts-prompt-form__fields">
          {children}
        </div>
        <div className="prompts-prompt-form__controls">
          <Button type="submit">Submit</Button>
          <Button onClick={onCancel} color="platinum">Cancel</Button>
        </div>
      </form>
    </div>
    <Issues
      issues={issues}
      show={submitFailed}
    />
  </div>
);

PromptForm.propTypes = {
  children: PropTypes.node,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

PromptForm.defaultProps = {
  children: null,
};

export default compose(
  reduxForm(formOptions),
  withFormSubmitErrors(formOptions.form),
)(PromptForm);
