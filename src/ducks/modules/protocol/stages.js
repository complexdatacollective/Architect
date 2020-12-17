import uuid from 'uuid/v1';
import { get, compact } from 'lodash';
import { arrayMove } from 'react-sortable-hoc';
import prune from '@app/utils/prune';

const CREATE_STAGE = 'PROTOCOL/CREATE_STAGE';
const UPDATE_STAGE = 'PROTOCOL/UPDATE_STAGE';
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
        prune(action.stage),
        ...state.slice(insertAtIndex),
      ];
    }
    case UPDATE_STAGE:
      return state.map((stage) => {
        if (stage.id !== action.id) { return stage; }

        const previousStage = !action.overwrite ? stage : {};

        const newStage = {
          ...previousStage,
          ...action.stage,
          id: stage.id,
        };

        return prune(newStage);
      });
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
  deleteStage,
  moveStage,
  deletePrompt,
};

const actionTypes = {
  CREATE_STAGE,
  UPDATE_STAGE,
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
