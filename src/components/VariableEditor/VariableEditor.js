import React from 'react';
import { Form, Field } from 'redux-form';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Guided } from '../Guided';
import Guidance from '../Guidance';
import FormCodeView from '../FormCodeView';
import * as ArchitectFields from '../Form/Fields';

const VariableEditor = ({
  handleSubmit,
  toggleCodeView,
  codeView,
  form,
  dirty,
  valid,
}) => (
  <Form onSubmit={handleSubmit} className={cx('stage-editor', { 'stage-editor--show-code': codeView })}>
    <FormCodeView toggleCodeView={toggleCodeView} form={form} />
    <Guided
      className="stage-editor__sections"
      form={form}
    >
      <h1>Edit Variable</h1>
      { dirty && !valid && (
        <p style={{ color: 'var(--error)' }}>
          There are some errors that need to be fixed before this can be saved!
        </p>
      ) }
      <small>(<a onClick={toggleCodeView}>Show Code View</a>)</small>

      <Guidance contentId="guidance.form.variables">
        <div className="stage-editor-section">
          <h2>Color</h2>

          <Field
            component={ArchitectFields.ColorPicker}
            name="color"
          />
        </div>
      </Guidance>
    </Guided>
  </Form>
);

VariableEditor.propTypes = {
  toggleCodeView: PropTypes.func.isRequired,
  codeView: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
};

export { VariableEditor };

export default VariableEditor;
