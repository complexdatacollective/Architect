/* eslint-disable import/prefer-default-export */

import { combineEpics } from 'redux-observable';
import linkPreviewStore from './linkPreviewStore';
import previewReducer from './preview';

const rootEpic = combineEpics(
  linkPreviewStore,
);

const rootReducer = previewReducer;

export {
  rootEpic,
  rootReducer,
};
