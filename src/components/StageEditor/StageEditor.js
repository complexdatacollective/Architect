import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import { compose, defaultProps } from 'recompose';
import Editor from '@components/Editor';
import { Layout } from '@components/EditorLayout';
import { getInterface } from './Interfaces';
import withStageEditorHandlers from './withStageEditorHandlers';
import withStageEditorMeta from './withStageEditorMeta';
import { formName } from './configuration';
import StageHeading, { CondensedStageHeading } from './StageHeading';
import CollapsableHeader from '../Screen/CollapsableHeader';

const StageEditor = (props) => {
  const {
    id,
    previewStage,
    interfaceType,
    stagePath,
    hasSkipLogic,
    ...rest
  } = props;
  useEffect(() => {
    ipcRenderer.on('REFRESH_PREVIEW', previewStage);

    return () => ipcRenderer.removeListener('REFRESH_PREVIEW', previewStage);
  }, []);

  const sections = useMemo(
    () => getInterface(interfaceType).sections,
    [interfaceType],
  );

  const renderSections = (
    sectionsList, { submitFailed },
  ) => sectionsList.map((SectionComponent, sectionIndex) => {
    const sectionKey = `${interfaceType}-${sectionIndex}`;
    return (
      <SectionComponent
        key={sectionKey}
        form={formName}
        stagePath={stagePath}
        hasSubmitFailed={submitFailed}
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
        ({ submitFailed }) => (
          <>
            <CollapsableHeader
              threshold={165}
              collapsedState={<CondensedStageHeading id={id} />}
            >
              <StageHeading id={id} />
            </CollapsableHeader>
            <Layout>
              {renderSections(sections, { submitFailed })}
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
