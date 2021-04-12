import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import { compose, defaultProps } from 'recompose';
import Editor from '@components/Editor';
import { Layout } from '@components/EditorLayout';
import FormCodeView from '@components/CodeView/FormCodeView';
import { getInterface } from './Interfaces';
import withStageEditorHandlers from './withStageEditorHandlers';
import withStageEditorMeta from './withStageEditorMeta';
import StageHeading from './StageHeading';
import SkipLogic from './SkipLogic';
import { formName } from './configuration';

const StageEditor = ({
  id,
  previewStage,
  interfaceType,
  stagePath,
  hasSkipLogic,
  ...props
}) => {
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

  const headerSections = useMemo(
    () => getInterface(interfaceType).headerSections,
    [interfaceType],
  );

  const renderSections = (
    sectionList, { submitFailed, windowRoot },
  ) => sectionList.map((SectionComponent) => (
    <SectionComponent
      key={stagePath}
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
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {
        ({ submitFailed, windowRoot }) => (
          <Layout>
            <FormCodeView
              form={formName}
              show={showCodeView}
              toggleCodeView={toggleShowCodeView}
            />
            <StageHeading id={id} toggleCodeView={toggleShowCodeView}>
              { headerSections && renderSections(headerSections, { submitFailed, windowRoot })}
              <SkipLogic />
            </StageHeading>
            {renderSections(sections, { submitFailed, windowRoot })}
          </Layout>
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
