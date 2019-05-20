import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import Editor from '../Editor';
import { getInterface } from './Interfaces';

const formName = 'edit-stage';

class StageEditor extends Component {
  componentDidMount() {
    ipcRenderer.on('REFRESH_PREVIEW', this.handleRefresh);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('REFRESH_PREVIEW', this.handleRefresh);
  }

  sections() {
    return getInterface(this.props.interfaceType).sections;
  }

  name() {
    return getInterface(this.props.interfaceType).name || this.props.interfaceType;
  }

  handleRefresh = () => {
    this.props.previewStage();
  }

  render() {
    return (
      <Editor
        formName={formName}
        title={`Editing ${this.name()}`}
        {...this.props}
      >
        {
          ({ submitFailed, windowRoot }) =>
            this.sections().map((SectionComponent, index) => (
              <SectionComponent
                key={index}
                form={formName}
                hasSubmitFailed={submitFailed}
                // `windowRoot` will ensure connect() components re-render
                // when the window root changes
                windowRoot={windowRoot}
                interfaceType={this.props.interfaceType}
              />
            ))
        }
      </Editor>
    );
  }
}

StageEditor.propTypes = {
  interfaceType: PropTypes.string.isRequired,
};

export {
  formName,
  StageEditor,
};

export default StageEditor;
