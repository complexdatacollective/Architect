import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import stages from './stages';
import variableRegistry from './variableRegistry';
import protocolOptions from './protocolOptions';
import { epics as exportEpics } from './export';

export default combineReducers({
  options: protocolOptions,
  stages,
  variableRegistry,
});

export const epics = combineEpics(
  exportEpics,
);
