import uuid from 'uuid/v1';
import { get, compact, set } from 'lodash';
import { arrayMove } from 'react-sortable-hoc';

const CREATE_STAGE = 'PROTOCOL/CREATE_STAGE';
const UPDATE_STAGE = 'PROTOCOL/UPDATE_STAGE';
const UPDATE_PATH = 'PROTOCOL/UPDATE_PATH';
const MOVE_STAGE = 'PROTOCOL/MOVE_STAGE';
const DELETE_STAGE = 'PROTOCOL/DELETE_STAGE';
const DELETE_PROMPT = 'PROTOCOL/DELETE_PROMPT';

const initialState = [];
const initialStage = {
  label: '',
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CREATE_STAGE: {
      const insertAtIndex = get(action, 'index', state.length);

      return [
        ...state.slice(0, insertAtIndex),
        action.stage,
        ...state.slice(insertAtIndex),
      ];
    }
    case UPDATE_STAGE:
      return state.map((stage) => {
        if (stage.id !== action.id) { return stage; }

        if (action.overwrite) { return { ...action.stage, id: stage.id }; }

        return {
          ...stage,
          ...action.stage,
          id: stage.id,
        };
      });
    case UPDATE_PATH: {
      const payload = action.payload;
      return state.map((stage) => {
        if (stage.id !== payload.id) { return stage; }

        const newStage = payload.path ?
          set({ ...stage }, payload.path, payload.value) :
          payload.value;

        return {
          ...newStage,
          id: stage.id,
        };
      });
    }
    case MOVE_STAGE:
      return arrayMove(state, action.oldIndex, action.newIndex);
    case DELETE_STAGE:
      return state.filter(stage => (stage.id !== action.id));
    case DELETE_PROMPT:
      return compact(
        state.map((stage) => {
          if (stage.id !== action.stageId) { return stage; }

          const prompts = stage.prompts.filter(({ id }) => id !== action.promptId);

          // If prompt is empty, we can delete the stage too
          if (action.deleteEmptyStage && prompts.length === 0) { return null; }

          return {
            ...stage,
            prompts,
          };
        }),
      );
    default:
      return state;
  }
}

const createStage = (stage, index) => ({
  type: CREATE_STAGE,
  stage,
  index,
});

const moveStage = (oldIndex, newIndex) => ({
  type: MOVE_STAGE,
  oldIndex,
  newIndex,
});

const updateStage = (stageId, stage, overwrite = false) => ({
  type: UPDATE_STAGE,
  id: stageId,
  stage,
  overwrite,
});

const updatePath = (stageId, path, value) => ({
  type: UPDATE_PATH,
  payload: {
    id: stageId,
    path,
    value,
  },
});

const deleteStage = stageId => ({
  type: DELETE_STAGE,
  id: stageId,
});

const deletePrompt = (stageId, promptId, deleteEmptyStage = false) => ({
  type: DELETE_PROMPT,
  stageId,
  promptId,
  deleteEmptyStage,
});

const createStageThunk = (options, index) =>
  (dispatch) => {
    const stageId = uuid();
    const stage = { ...initialStage, ...options, id: stageId };
    dispatch(createStage(stage, index));
    return stage;
  };

const actionCreators = {
  createStage: createStageThunk,
  updateStage,
  updatePath,
  deleteStage,
  moveStage,
  deletePrompt,
};

const actionTypes = {
  CREATE_STAGE,
  UPDATE_STAGE,
  UPDATE_PATH,
  DELETE_STAGE,
  MOVE_STAGE,
  DELETE_PROMPT,
};

export const test = {
  createStage,
};

export {
  actionCreators,
  actionTypes,
};
