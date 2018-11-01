import { ipcRenderer } from 'electron';
import { omit } from 'lodash';
import { getFormValues } from 'redux-form';
import { getActiveProtocolMeta } from '../../selectors/protocol';
import previewStoreData from './previewStore.json';
import rootReducer from '../../network-canvas/src/ducks/modules/rootReducer';

// TODO: This contains actionCreators that overlap stores, and probably ought to be separated

const initialState = {
  ...previewStoreData,
};

const SET_PROTOCOL = 'PREVIEW/SET_PROTOCOL';
const PREVIEW_DRAFT = 'PREVIEW/PREVIEW_DRAFT';
const CLOSE_PREVIEW = 'PREVIEW/CLOSE_PREVIEW';
const PREVIEW_STAGE_BY_FORMNAME = 'PREVIEW/PREVIEW_STAGE_BY_FORMNAME';

// previewStore
const setProtocol = ({ protocol, path, stageIndex = 0 }) => ({
  type: SET_PROTOCOL,
  protocol,
  path,
  stageIndex,
});

// store
const closePreview = () =>
  (dispatch) => {
    dispatch({
      type: CLOSE_PREVIEW,
    });

    ipcRenderer.send('CLOSE_PREVIEW');
  };

// store
const previewDraft = (draft, stageIndex) =>
  (dispatch, getState) => {
    dispatch({
      type: PREVIEW_DRAFT,
      meta: {
        draft,
        stageIndex,
      },
    });

    const state = getState();

    const activeProtocolMeta = getActiveProtocolMeta(state);
    const workingPath = activeProtocolMeta && activeProtocolMeta.workingPath;

    const protocol = state.protocol.present;

    const draftProtocol = {
      ...protocol,
      ...draft,
    };

    ipcRenderer.send('OPEN_PREVIEW', { protocol: draftProtocol, path: workingPath, stageIndex });
  };

// store
const previewStageByFormName = (stageMeta, formName) =>
  (dispatch, getState) => {
    dispatch({
      type: PREVIEW_STAGE_BY_FORMNAME,
      meta: {
        formName,
        stage: stageMeta,
      },
    });

    const state = getState();

    const draftStage = getFormValues(formName)(state);
    const protocol = state.protocol.present;
    let stageIndex;
    let draftStages;

    // TODO: use reducer?
    if (stageMeta.id) {
      stageIndex = protocol.stages.findIndex(({ id }) => id === stageMeta.id);

      draftStages = protocol.stages.map((stage) => {
        if (stage.id !== draftStage.id) { return stage; }
        return draftStage;
      });
    } else {
      stageIndex = stageMeta.insertAtIndex;

      draftStages = [
        ...protocol.stages.slice(0, stageMeta.insertAtIndex),
        draftStage,
        ...protocol.stages.slice(stageMeta.insertAtIndex),
      ];
    }

    const draftProtocol = {
      stages: draftStages,
    };

    dispatch(previewDraft(draftProtocol, stageIndex));
  };

// previewStore
const previewReducer = (state = initialState, action) => {
  if (action.type === SET_PROTOCOL) {
    return {
      ...state,
      protocol: {
        ...state.protocol,
        ...omit(action.protocol, 'externalData'),
        path: action.path.slice(1),
        protocolPath: null,
      },
    };
  }

  return rootReducer(state, action);
};

const actionTypes = {
  SET_PROTOCOL,
  PREVIEW_DRAFT,
  PREVIEW_STAGE_BY_FORMNAME,
};

const actionCreators = {
  setProtocol,
  closePreview,
  previewDraft,
  previewStageByFormName,
};

export {
  actionTypes,
  actionCreators,
};

export default previewReducer;
