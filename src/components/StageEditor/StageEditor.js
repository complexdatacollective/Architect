import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import { compose, defaultProps } from 'recompose';
import Editor from '@components/Editor';
import { Layout } from '@components/EditorLayout';
import CodeView from '@components/CodeView';
import { getInterface } from './Interfaces';
import withStageEditorHandlers from './withStageEditorHandlers';
import withStageEditorMeta from './withStageEditorMeta';
import { formName } from './configuration';
import StageHeading from './StageHeading';

const StageEditor = (props) => {
  const {
    id,
    previewStage,
    interfaceType,
    stagePath,
    hasSkipLogic,
    ...rest
  } = props;

  const [showCodeView, setShowCodeView] = useState(false);
  const toggleShowCodeView = () => setShowCodeView((show) => !show);

  useEffect(() => {
    ipcRenderer.on('REFRESH_PREVIEW', previewStage);

    return () => ipcRenderer.removeListener('REFRESH_PREVIEW', previewStage);
  }, []);

  const sections = useMemo(
    () => getInterface(interfaceType).sections,
    [interfaceType],
  );

  const renderSections = (
    sectionsList, { submitFailed, windowRoot },
  ) => sectionsList.map((SectionComponent, sectionIndex) => {
    const sectionKey = `${interfaceType}-${sectionIndex}`;
    return (
      <SectionComponent
        key={sectionKey}
        form={formName}
        stagePath={stagePath}
        hasSubmitFailed={submitFailed}
        // `windowRoot` will ensure connect() components re-render
        // when the window root changes
        windowRoot={windowRoot}
        interfaceType={interfaceType}
      />
    );
  });

  return (
    <Editor
      formName={formName}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      {
        ({ submitFailed, windowRoot }) => (
        <>
          <StageHeading id={id} toggleCodeView={toggleShowCodeView} />
          <Layout>
            <CodeView
              form={formName}
              show={showCodeView}
              toggleCodeView={toggleShowCodeView}
            />
            {renderSections(sections, { submitFailed, windowRoot })}
          </Layout>
        </>
        )
      }
    </Editor>
  );
};

StageEditor.propTypes = {
  interfaceType: PropTypes.string.isRequired,
  id: PropTypes.string,
  previewStage: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  stagePath: PropTypes.any,
  hasSkipLogic: PropTypes.bool,
};

StageEditor.defaultProps = {
  hasSkipLogic: false,
  id: null,
  stagePath: null,
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
