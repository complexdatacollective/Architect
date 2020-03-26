import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { set } from 'lodash';
import { getInterface } from '@components/Interfaces';
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

const useChangeHandler = (initialValues) => {
  const [stage, setStage] = useState(initialValues);

  const changeHandler = useCallback((path, value) => {
    const updatedStage = set({ ...stage }, path, value);
    setStage(updatedStage);
  }, [stage, setStage]);

  return [stage, changeHandler];
};

const StageEditor = ({
  interfaceType,
  previewStage,
  initialValues,
  ...props
}) => {
  const [stage, changeHandler] = useChangeHandler(initialValues);
  const [sections, name] = useInterface(interfaceType);
  usePreviewListener(() => { previewStage(); });

  const styles = {
    background: 'rgba(255, 255, 255, 0.9)',
    zIndex: 9999,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: 'hidden',
    overflowX: 'scroll',
  };

  return (
    <div style={styles}>
      <h1>{name}</h1>
      {
        sections.map((SectionComponent, index) => (
          <SectionComponent
            key={index}
            interfaceType={interfaceType}
            onChange={changeHandler}
            stage={stage}
            l={stage.label}
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
