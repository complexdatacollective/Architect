import React from 'react';
import { reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { Flipped } from 'react-flip-toolkit';
import PropTypes from 'prop-types';
import stopPropagationFromHandler from '../../utils/stopPropagationFromHandler';
import Button from '../../ui/components/Button';

const formOptions = {
  form: 'prompt-form',
  touchOnBlur: false,
  touchOnChange: true,
};

const PromptForm = ({
  children,
  handleSubmit,
  onCancel,
  flipId,
}) => (
  <Flipped flipId={flipId}>
    <div className="prompts-prompt-form">
      <div className="prompts-prompt-form__content">
        <form onSubmit={stopPropagationFromHandler(handleSubmit)}>
          <h1>Edit Prompt</h1>
          <div className="prompts-prompt-form__fields">
            {children}
          </div>
          <div className="prompts-prompt-form__controls">
            <Button type="submit">Continue</Button>
            <Button onClick={onCancel} color="platinum">Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  </Flipped>
);

PromptForm.propTypes = {
  children: PropTypes.node,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  submitFailed: PropTypes.bool,
  flipId: PropTypes.string,
};

PromptForm.defaultProps = {
  children: null,
  submitFailed: false,
  flipId: null,
};

export default compose(
  reduxForm(formOptions),
)(PromptForm);
