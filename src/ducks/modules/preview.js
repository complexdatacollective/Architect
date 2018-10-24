import { ipcRenderer } from 'electron';
import { omit } from 'lodash';
import { getFormValues } from 'redux-form';
import previewStoreData from '../../components/Preview/previewStore.json';
import rootReducer from '../../network-canvas/src/ducks/modules/rootReducer';

const initialState = {
  ...previewStoreData,
};

const SET_PROTOCOL = 'ARCHITECT/SET_PROTOCOL';
const PREVIEW_DRAFT = 'ARCHITECT/PREVIEW_DRAFT';
const PREVIEW_STAGE_BY_FORMNAME = 'ARCHITECT/PREVIEW_STAGE_BY_FORMNAME';

const setProtocol = (protocol, stageIndex = 0) => ({
  type: SET_PROTOCOL,
  protocol,
  stageIndex,
});

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

    const protocol = state.protocol.present;

    const draftProtocol = {
      ...protocol,
      ...draft,
    };

    ipcRenderer.send('OPEN_PREVIEW', { protocol: draftProtocol, stageIndex });
  };


const previewStageByFormName = formName =>
  (dispatch, getState) => {
    dispatch({
      type: PREVIEW_STAGE_BY_FORMNAME,
      meta: {
        formName,
      },
    });

    const state = getState();

    const draftStage = getFormValues(formName)(state);
    const protocol = state.protocol.present;
    const stageIndex = protocol.stages.findIndex(({ id }) => id === draftStage.id);

    const draftStages = protocol.stages.map((stage) => {
      if (stage.id !== draftStage.id) { return stage; }
      return draftStage;
    });

    const draftProtocol = {
      stages: draftStages,
    };

    dispatch(previewDraft(draftProtocol, stageIndex));
  };

const previewReducer = (state = initialState, action) => {
  if (action.type === SET_PROTOCOL) {
    return {
      ...state,
      protocol: {
        ...state.protocol,
        ...omit(action.protocol, 'externalData'),
        protocolPath: null, // TODO: Do we need this for assets?
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
  previewDraft,
  previewStageByFormName,
};

export {
  actionTypes,
  actionCreators,
};

export default previewReducer;
