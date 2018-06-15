import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Form as ReduxForm, formValueSelector, formPropTypes } from 'redux-form';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers } from 'recompose';
import cx from 'classnames';
import { Button } from '../../ui/components';
import { Guided } from '../Guided';
import flatten from '../../utils/flatten';
import { getInterface } from './Interfaces';
import CodeView from './CodeView';

const formName = 'edit-stage';
const getFormValues = formValueSelector(formName);
const form = { name: formName, getValues: getFormValues };

const StageEditor = ({
  stage,
  handleSubmit,
  toggleCodeView,
  codeView,
  dirty,
  invalid,
}) => (
  <ReduxForm onSubmit={handleSubmit} className={cx('stage-editor', { 'stage-editor--show-code': codeView })}>
    <CodeView toggleCodeView={toggleCodeView} form={form} />
    <Guided
      className="stage-editor__sections"
      sections={getInterface(stage.type).sections}
      defaultGuidance={getInterface(stage.type).guidance}
      form={form}
    >
      <h1>Edit {stage.type} Screen</h1>
      { dirty && invalid && (
        <p style={{ color: 'var(--error)' }}>
          There are some errors that need to be fixed before this can be saved!
        </p>
      ) }
      <Button size="small" type="button" onClick={toggleCodeView}>Show Code View</Button>
    </Guided>
  </ReduxForm>
);

StageEditor.propTypes = {
  stage: PropTypes.object.isRequired,
  toggleCodeView: PropTypes.func.isRequired,
  codeView: PropTypes.bool.isRequired,
  ...formPropTypes,
};

function mapStateToProps(state, props) {
  return { initialValues: props.stage };
}

export default compose(
  connect(mapStateToProps),
  withState('codeView', 'updateCodeView', false),
  withHandlers({
    toggleCodeView: ({ updateCodeView }) => () => updateCodeView(current => !current),
  }),
  reduxForm({
    form: formName,
    touchOnBlur: false,
    touchOnChange: true,
    enableReinitialize: true,
    onSubmitFail: (errors) => {
      // eslint-disable-next-line no-console
      console.error('FORM ERRORS', flatten(errors));
    },
  }),
)(StageEditor);
