import { getFormValues } from 'redux-form';
import { getWorkingPath } from '@selectors/session';
import { getProtocol } from '@selectors/protocol';
import previewDriver from '@app/utils/previewDriver';

const getStageIndex = (protocol, stageMeta) => {
  if (stageMeta.id) {
    return protocol.stages.findIndex(({ id }) => id === stageMeta.id);
  }

  if (stageMeta.insertAtIndex !== undefined) {
    return stageMeta.insertAtIndex;
  }

  return protocol.stages.length;
};

const getDraftStages = (protocol, stageMeta, draftStage) => {
  const { stages } = protocol;

  if (stageMeta.id) {
    return stages.map((stage) => {
      if (stage.id === draftStage.id) { return draftStage; }

      return stage;
    });
  }

  const stageIndex = getStageIndex(protocol, stageMeta);

  return [
    ...protocol.stages.slice(0, stageIndex),
    draftStage,
    ...protocol.stages.slice(stageIndex),
  ];
};

const SET_ZOOM = 'PREVIEW/ZOOM';
const REFRESH_PREVIEW = 'PREVIEW/REFRESH_PREVIEW';
const PREVIEW_DRAFT = 'PREVIEW/PREVIEW_DRAFT';
const CLOSE_PREVIEW = 'PREVIEW/CLOSE_PREVIEW';
const CLEAR_PREVIEW = 'PREVIEW/CLEAR_PREVIEW';

const zoom = (zoomFactor) => ({
  type: SET_ZOOM,
  zoom: zoomFactor,
});

const refresh = () => ({
  type: REFRESH_PREVIEW,
});

const closePreview = () => (dispatch) => {
  dispatch({ type: CLOSE_PREVIEW });
  previewDriver.close();
};

const clearPreview = () => (dispatch) => {
  dispatch({
    type: CLEAR_PREVIEW,
  });

  previewDriver.clear();
};

const previewDraft = (draft, stageIndex) => (dispatch, getState) => {
  const state = getState();

  const workingPath = getWorkingPath(state);

  const draftProtocol = {
    ...draft,
    /**
       * This allows assets to work correctly in the Network Canvas preview.
       *
       * Network canvas uses relative paths for the assets:// protocol, whereas
       * Architect uses full paths. Since Network Canvas prepares urls as:
       * `assets://${protocolUID}/assets/${asset}` this allows us to load files
       * from the correct location.
       */
    uid: workingPath,
  };

  dispatch({
    type: PREVIEW_DRAFT,
    draft: draftProtocol,
    stageIndex,
  });

  previewDriver.preview(draftProtocol, stageIndex);
};

const previewStageFromForm = (stageMeta, formName) => (dispatch, getState) => {
  const state = getState();
  const protocol = getProtocol(state);

  const draftStage = getFormValues(formName)(state);
  const stageIndex = getStageIndex(protocol, stageMeta);
  const draftStages = getDraftStages(protocol, stageMeta, draftStage);
  const draftProtocol = { ...protocol, stages: draftStages };

  dispatch(previewDraft(draftProtocol, stageIndex));
};

const actionTypes = {
  PREVIEW_DRAFT,
  SET_ZOOM,
  REFRESH_PREVIEW,
  CLEAR_PREVIEW,
};

const actionCreators = {
  closePreview,
  clearPreview,
  previewDraft,
  previewStageFromForm,
  zoom,
  refresh,
};

export {
  actionTypes,
  actionCreators,
};
