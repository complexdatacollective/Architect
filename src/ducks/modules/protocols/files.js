import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import { create } from '../../../other/protocols';
import { actionCreators as protocolsActions } from '../protocols';

const CREATE_PROTOCOL = Symbol('PROTOCOL/CREATE_PROTOCOL');
const LOAD_PROTOCOL = Symbol('PROTOCOL/LOAD_PROTOCOL');

const createProtocol = () => ({ type: CREATE_PROTOCOL });
const loadProtocol = () => ({ type: LOAD_PROTOCOL });

const createProtocolEpic = action$ =>
  action$.ofType(CREATE_PROTOCOL)
    .mergeMap(() =>
      Observable
        .fromPromise(create())
        .map(protocolPath => protocolsActions.addProtocol(protocolPath)),
    );

const actionCreators = {
  createProtocol,
  loadProtocol,
};

const actionTypes = {
  CREATE_PROTOCOL,
  LOAD_PROTOCOL,
};

const epics = combineEpics(
  createProtocolEpic,
);

export {
  actionCreators,
  actionTypes,
  epics,
};
