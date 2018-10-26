import React, { Component } from 'react';
import {
  Form as ReduxForm,
  formValueSelector,
  formPropTypes,
} from 'redux-form';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Guided } from '../Guided';
import { getInterface } from './Interfaces';
import { FormCodeView } from '../CodeView';
import Issues from '../Issues';

const formName = 'edit-stage';
const getFormValues = formValueSelector(formName);
const form = { name: formName, getValues: getFormValues };

class StageEditor extends Component {
  componentDidMount() {
    ipcRenderer.on('REFRESH_PREVIEW', this.handleRefresh);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('REFRESH_PREVIEW', this.handleRefresh);
  }

  get sections() {
    return getInterface(this.props.stage.type).sections;
  }

  handleRefresh = () => {
    this.props.previewStage();
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
          <h1>Edit {stage.type} Screen</h1>
          <small>(<a onClick={toggleCodeView}>Show Code View</a>)</small>

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

export { StageEditor };

export default StageEditor;
