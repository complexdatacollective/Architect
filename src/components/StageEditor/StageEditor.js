import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  reduxForm,
  Form as ReduxForm,
  formValueSelector,
  formPropTypes,
  getFormSyncErrors,
} from 'redux-form';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers } from 'recompose';
import cx from 'classnames';
import { Guided } from '../Guided';
import { getInterface } from './Interfaces';
import { FormCodeView } from '../CodeView';
import Issues from '../Issues';

const formName = 'edit-stage';
const getFormValues = formValueSelector(formName);
const form = { name: formName, getValues: getFormValues };

class StageEditor extends Component {
  get sections() {
    return getInterface(this.props.stage.type).sections;
  }

  renderSections() {
    return this.sections.map((SectionComponent, index) =>
      <SectionComponent key={index} form={form} hasSubmitFailed={this.props.submitFailed} />,
    );
  }

  render() {
    const {
      stage,
      handleSubmit,
      toggleCodeView,
      codeView,
      issues,
      submitFailed,
    } = this.props;

    return (
      <ReduxForm onSubmit={handleSubmit} className={cx('stage-editor', { 'stage-editor--show-code': codeView })}>
        <FormCodeView toggleCodeView={toggleCodeView} form={form.name} />
        <Guided
          className="stage-editor__sections"
          defaultGuidance={`guidance.interface.${stage.type}`}
          form={form}
        >
          <div className="code-button">
            <small>
              (<a onClick={toggleCodeView}>Show Code View</a>)
            </small>
          </div>
          <h1 className="editor__heading">Edit {stage.type} Screen</h1>

          {this.renderSections()}

          <Issues issues={issues} show={submitFailed} />
        </Guided>
      </ReduxForm>
    );
  }
}

StageEditor.propTypes = {
  stage: PropTypes.object.isRequired,
  toggleCodeView: PropTypes.func.isRequired,
  codeView: PropTypes.bool.isRequired,
  ...formPropTypes,
};

const mapStateToProps = (state, props) => {
  const issues = getFormSyncErrors(formName)(state);
  return {
    initialValues: props.stage,
    issues,
  };
};

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
  }),
)(StageEditor);
