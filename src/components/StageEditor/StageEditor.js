import React, { useEffect, useMemo } from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { compose, defaultProps } from 'recompose';
import Editor from '@components/Editor';
import { getInterface } from './Interfaces';
import withStageEditorHandlers from './withStageEditorHandlers';
import withStageEditorMeta from './withStageEditorMeta';
import StageHeading from './StageHeading';
import SkipLogic from './SkipLogic';

const formName = 'edit-stage';

const StageEditor = ({
  id,
  previewStage,
  interfaceType,
  stagePath,
  hasSkipLogic,
  ...props
}) => {
  useEffect(() => {
    ipcRenderer.on('REFRESH_PREVIEW', previewStage);

    return () =>
      ipcRenderer.removeListener('REFRESH_PREVIEW', previewStage);
  }, []);

  const sections = useMemo(
    () => getInterface(interfaceType).sections,
    [interfaceType],
  );

  const renderSections = ({ submitFailed, windowRoot }) =>
    sections.map((SectionComponent, index) => (
      <SectionComponent
        key={index}
        form={formName}
        stagePath={stagePath}
        hasSubmitFailed={submitFailed}
        // `windowRoot` will ensure connect() components re-render
        // when the window root changes
        windowRoot={windowRoot}
        interfaceType={interfaceType}
      />
    ));

  return (
    <Editor
      formName={formName}
      {...props}
    >
      {
        ({ submitFailed, windowRoot }) => (
          <div className="stage-editor">
            <StageHeading id={id} />
            <div className="stage-editor-section stage-editor-section--no-border">
              <SkipLogic />
            </div>
            {renderSections({ submitFailed, windowRoot })}
          </div>
        )
      }
    </Editor>
  );
};

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
