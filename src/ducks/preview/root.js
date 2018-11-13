/* eslint-disable import/prefer-default-export */

import { combineEpics } from 'redux-observable';
import previewReducer, { epics } from './preview';

const rootEpic = combineEpics(
  epics,
);

const rootReducer = previewReducer;

export {
  rootEpic,
  rootReducer,
};
