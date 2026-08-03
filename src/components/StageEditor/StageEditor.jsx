import Editor from '@components/Editor';
import { Layout } from '@components/EditorLayout';
import { electronAPI } from '@utils/electronBridge';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { compose, defaultProps } from 'recompose';

import CodeView from '../CodeView';
import CollapsableHeader from '../Screen/CollapsableHeader';
import { formName } from './configuration';
import { getInterface } from './Interfaces';
import StageHeading, { CondensedStageHeading } from './StageHeading';
import withStageEditorHandlers from './withStageEditorHandlers';
import withStageEditorMeta from './withStageEditorMeta';

const StageEditor = (props) => {
  const { id, previewStage, interfaceType, stagePath, hasSkipLogic, ...rest } =
    props;

  const [showCodeView, setShowCodeView] = useState(false);

  const toggleCodeView = useCallback(() => {
    setShowCodeView((state) => !state);
  }, []);

  const handleKeyDown = useCallback((event) => {
    if (event.ctrlKey && event.key === '/') {
      toggleCodeView();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const cleanup = electronAPI.ipc.on('REFRESH_PREVIEW', previewStage);

    return cleanup;
  }, [previewStage]);

  const sections = useMemo(
    () => getInterface(interfaceType).sections,
    [interfaceType],
  );

  const renderSections = (sectionsList, { submitFailed }) =>
    sectionsList.map((SectionComponent, sectionIndex) => {
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
    <Editor formName={formName} {...rest}>
      {({ submitFailed }) => (
        <>
          <CodeView
            form={formName}
            show={showCodeView}
            toggleCodeView={toggleCodeView}
          />
          <CollapsableHeader
            threshold={165}
            collapsedState={<CondensedStageHeading id={id} />}
          >
            <StageHeading id={id} />
          </CollapsableHeader>
          <Layout>{renderSections(sections, { submitFailed })}</Layout>
        </>
      )}
    </Editor>
  );
};

StageEditor.propTypes = {
  interfaceType: PropTypes.string.isRequired,
  id: PropTypes.string,
  previewStage: PropTypes.func.isRequired,
  stagePath: PropTypes.any,
  hasSkipLogic: PropTypes.bool,
};

StageEditor.defaultProps = {
  hasSkipLogic: false,
  id: null,
  stagePath: null,
};

export { formName };

export default compose(
  defaultProps({
    form: formName,
  }),
  withStageEditorMeta,
  withStageEditorHandlers,
)(StageEditor);
