import React, { useEffect, useRef } from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { getInterface } from './Interfaces';
import withStageEditorHandlers from './withStageEditorHandlers';
import withStageEditorMeta from './withStageEditorMeta';

const usePreviewListener = (onRefresh) => {
  const handleRefresh = useRef(onRefresh);
  const listener = useRef(null);

  useEffect(() => {
    if (!listener.current) {
      ipcRenderer.on('REFRESH_PREVIEW', handleRefresh.current);
    }

    return () => {
      ipcRenderer.removeListener('REFRESH_PREVIEW', handleRefresh.current);
    };
  }, [handleRefresh]);
};

const useInterface = (interfaceType) => {
  const iface = getInterface(interfaceType);
  const name = iface.name || interfaceType;
  return [iface.sections, name];
};

const StageEditor = ({ interfaceType, previewStage, ...props }) => {
  const [sections, name] = useInterface(interfaceType);
  usePreviewListener(() => { previewStage(); });

  return (
    <div>
      <h1>{name}</h1>
      {
        sections.map((SectionComponent, index) => (
          <SectionComponent
            key={index}
            interfaceType={interfaceType}
            {...props}
          />
        ))
      }
    </div>
  );
};

StageEditor.propTypes = {
  interfaceType: PropTypes.string.isRequired,
  previewStage: PropTypes.func.isRequired,
};

export {
  StageEditor,
};

export default compose(
  withStageEditorMeta,
  withStageEditorHandlers,
)(StageEditor);
