import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { compose, defaultProps } from 'recompose';
import cx from 'classnames';
import Editor from '@components/Editor';
import { getInterface } from './Interfaces';
import withStageEditorHandlers from './withStageEditorHandlers';
import withStageEditorMeta from './withStageEditorMeta';
import StageHeading from './StageHeading';
import Tabs from './Tabs';

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

  renderSections({ submitFailed, windowRoot }) {
    return this.sections().map((SectionComponent, index) => (
      <SectionComponent
        key={index}
        form={formName}
        stagePath={this.props.stagePath}
        hasSubmitFailed={submitFailed}
        // `windowRoot` will ensure connect() components re-render
        // when the window root changes
        windowRoot={windowRoot}
        interfaceType={this.props.interfaceType}
      />
    ));
  }

  render() {
    const panelClasses = selected => cx(
      'stage-editor__panel',
      { 'stage-editor__panel--selected': selected },
    );

    const tabClasses = selected => cx(
      'stage-editor__tab',
      { 'stage-editor__tab--selected': selected },
    );

    return (
      <Editor
        formName={formName}
        {...this.props}
      >
        {
          ({ submitFailed, windowRoot }) => (
            <div className="stage-editor">
              <StageHeading id={this.props.id} />
              <Tabs>
                {({ selectedTab, selectTab }) => (
                  <div className="stage-editor__tabs">
                    <div className="stage-editor__tablist">
                      <div className={tabClasses(selectedTab === 0)} onClick={() => selectTab(0)}>Stage</div>
                      <div className={tabClasses(selectedTab === 1)} onClick={() => selectTab(1)}>Skip Logic</div>
                    </div>
                    <div className={panelClasses(selectedTab === 0)}>
                      {this.renderSections({ submitFailed, windowRoot })}
                    </div>
                    <div className={panelClasses(selectedTab === 1)}>
                      skip logic
                    </div>
                  </div>
                )}
              </Tabs>
            </div>
          )
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

export default compose(
  defaultProps({
    form: formName,
  }),
  withStageEditorMeta,
  withStageEditorHandlers,
)(StageEditor);
