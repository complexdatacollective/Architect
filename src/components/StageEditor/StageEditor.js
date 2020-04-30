import React, { useEffect, useMemo, useState } from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { compose, defaultProps } from 'recompose';
import cx from 'classnames';
import { motion } from 'framer-motion';
import Editor from '@components/Editor';
import { getInterface } from './Interfaces';
import withStageEditorHandlers from './withStageEditorHandlers';
import withStageEditorMeta from './withStageEditorMeta';
import StageHeading from './StageHeading';

const formName = 'edit-stage';

const tabVariants = {
  active: { opacity: 1, height: 'auto', position: 'static' },
  inactive: { opacity: 0, height: 0, position: 'absolute', top: 0 },
};

const StageEditor = ({
  id,
  previewStage,
  interfaceType,
  stagePath,
  ...props
}) => {
  const [tab, setTab] = useState(0);

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
      {...props}
    >
      {
        ({ submitFailed, windowRoot }) => (
          <div className="stage-editor">
            <StageHeading id={id} />
            <div className="stage-editor__tabs">
              <div className="stage-editor__tablist">
                <div
                  className={tabClasses(tab === 0)}
                  onClick={() => setTab(0)}
                >Stage</div>
                <div
                  className={tabClasses(tab === 1)}
                  onClick={() => setTab(1)}
                >Skip logic</div>
              </div>
              <div className="stage-editor__panels">
                <motion.div
                  className={panelClasses()}
                  variants={tabVariants}
                  animate={tab === 0 ? 'active' : 'inactive'}
                >
                  {renderSections({ submitFailed, windowRoot })}
                </motion.div>
                <motion.div
                  className={panelClasses()}
                  variants={tabVariants}
                  animate={tab === 1 ? 'active' : 'inactive'}
                >
                  skip logic
                </motion.div>
              </div>
            </div>
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
