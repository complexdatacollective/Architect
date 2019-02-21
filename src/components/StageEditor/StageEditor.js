import React, { Component } from 'react';
import {
  Form as ReduxForm,
  formValueSelector,
  formPropTypes,
} from 'redux-form';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { Guided } from '../Guided';
import { getInterface } from './Interfaces';
import { FormCodeView } from '../CodeView';
import Issues from '../Issues';
import windowRootProvider from '../../ui/components/windowRootProvider';

const formName = 'edit-stage';
const getFormValues = formValueSelector(formName);
const form = { name: formName, getValues: getFormValues };

const INTERFACE_NAMES = {
  Information: 'Information',
  NameGenerator: 'Name Generator',
  NameGeneratorList: 'Roster Name Generator (list)',
  NameGeneratorAutoComplete: 'Roster Name Generator (search)',
  Sociogram: 'Sociogram',
};

const getInterfaceName = type => INTERFACE_NAMES[type] || type;

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
    return this.sections.map((SectionComponent, index) => (
      <SectionComponent
        key={index}
        form={form}
        hasSubmitFailed={this.props.submitFailed}
        // `windowRoot` will ensure connect() components re-render when the window root changes
        windowRoot={this.props.windowRoot}
      />
    ));
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
      <React.Fragment>
        <FormCodeView toggleCodeView={toggleCodeView} form={form.name} show={codeView} />
        <Guided
          defaultGuidance={`guidance.interface.${stage.type}`}
          form={form}
        >
          <div className="editor stage-editor" ref={this.props.setWindowRoot} >
            <div className="editor__window">
              <div className="editor__content">
                <div className="code-button">
                  <small>(<a onClick={toggleCodeView}>Show Code View</a>)</small>
                </div>

                <h1 className="editor__heading">Edit {getInterfaceName(stage.type)}</h1>

                <ReduxForm onSubmit={handleSubmit}>
                  {this.renderSections()}
                </ReduxForm>
              </div>
              <Issues
                issues={issues}
                show={submitFailed}
              />
            </div>
          </div>
        </Guided>
      </React.Fragment>
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

export default windowRootProvider(StageEditor);
