import React from 'react';
import { reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { Flipped } from 'react-flip-toolkit';
import PropTypes from 'prop-types';
import Button from '@codaco/ui/lib/components/Button';
import { Section } from '@components/EditorLayout';
import stopPropagationFromHandler from '@app/utils/stopPropagationFromHandler';

const formOptions = {
  touchOnBlur: false,
  touchOnChange: true,
};

const Form = ({
  children,
  title,
  handleSubmit, // redux form wraps `onSubmit` and passes this prop in it's place
  onCancel,
  flipId,
}) => (
  <Flipped flipId={flipId}>
    <div className="editable-list-form">
      <div className="editable-list-form__container">
        <form onSubmit={stopPropagationFromHandler(handleSubmit)} className="editable-list-form__content">
          <Section>
            <h1>{title}</h1>
          </Section>
          {children}
        </form>
        <div className="editable-list-form__controls">
          <Button onClick={handleSubmit} type="submit">Save and continue</Button>
          <Button onClick={onCancel} color="platinum">Cancel</Button>
        </div>
      </div>
    </div>
  </Flipped>
);

Form.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  flipId: PropTypes.string,
};

Form.defaultProps = {
  title: null,
  children: null,
  flipId: null,
};

export { Form };

export default compose(
  reduxForm(formOptions),
)(Form);
