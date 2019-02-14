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
  handleSubmit, // redux form wraps `onSubmit` and passes this prop in it's place
  onCancel,
  flipId,
}) => (
  <Flipped flipId={flipId}>
    <div className="prompts-prompt-form">
      <div className="prompts-prompt-form__container">
        <form onSubmit={stopPropagationFromHandler(handleSubmit)} className="prompts-prompt-form__content">
          <h1>Edit Prompt</h1>
          <div className="prompts-prompt-form__fields">
            {children}
          </div>
        </form>
        <div className="prompts-prompt-form__controls">
          <Button onClick={handleSubmit} type="submit">Save and continue</Button>
          <Button onClick={onCancel} color="platinum">Cancel</Button>
        </div>
      </div>
    </div>
  </Flipped>
);

PromptForm.propTypes = {
  children: PropTypes.node,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  flipId: PropTypes.string,
};

PromptForm.defaultProps = {
  children: null,
  flipId: null,
};

export { PromptForm };

export default compose(
  reduxForm(formOptions),
)(PromptForm);
