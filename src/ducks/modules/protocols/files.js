import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import { create, load } from '../../../other/protocols';
import { actionCreators as protocolActions } from '../protocol';
import { actionCreators as protocolsActions } from '../protocols';

const CREATE_PROTOCOL = Symbol('PROTOCOL/CREATE_PROTOCOL');
const LOAD_PROTOCOL = Symbol('PROTOCOL/LOAD_PROTOCOL');

const createProtocol = () => ({ type: CREATE_PROTOCOL });
const loadProtocol = path => ({ type: LOAD_PROTOCOL, path });

const createProtocolEpic = action$ =>
  action$.ofType(CREATE_PROTOCOL)
    .mergeMap(() =>
      Observable
        .fromPromise(create())
        .map(protocolPath => protocolsActions.addProtocol(protocolPath)),
    );

const loadProtocolEpic = action$ =>
  action$.ofType(LOAD_PROTOCOL)
    .map(({ path }) =>
      protocolActions.setProtocol(load(path)),
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
  loadProtocolEpic,
);

export {
  actionCreators,
  actionTypes,
  epics,
};
