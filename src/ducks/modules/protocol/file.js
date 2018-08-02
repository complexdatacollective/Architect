import uuid from 'uuid';
import path from 'path';
import { has } from 'lodash';
import { openProtocol, saveProtocol, loadProtocolData } from '../../../other/protocols';
import { getProtocol } from '../../../selectors/protocol';

const OPEN_PROTOCOL = Symbol('PROTOCOL/OPEN');
const PROTOCOL_LOADED = Symbol('PROTOCOL/LOADED');
const LOAD_PROTOCOL_ERROR = Symbol('PROTOCOL/LOAD_ERROR');
const OPEN_PROTOCOL_ERROR = Symbol('PROTOCOL/OPEN_ERROR');
const SAVE_COMPLETE = Symbol('PROTOCOL/SAVE_COMPLETE');

const isNetcanvasFile = fileName =>
  path.extname(fileName) === '.netcanvas';

const prepareWorkingCopy = (protocolMeta) => {
  if (has(protocolMeta, 'workingPath')) {
    return Promise.resolve(protocolMeta);
  }

  return openProtocol(protocolMeta.archivePath)
    .then(
      ({ workingPath }) =>
        ({ ...protocolMeta, workingPath }),
    );
};

const metaFromNetcanvasFile = (protocols, archivePath) => {
  const protocolMeta = protocols.find(protocol => protocol.archivePath === archivePath);

  return ({
    archivePath,
    id: uuid(),
    ...protocolMeta,
  });
};

const metaFromWorkingPath = (protocols, workingPath) => {
  const protocolMeta = protocols.find(protocol => protocol.workingPath === workingPath);

  return ({
    workingPath,
    id: uuid(),
    advanced: true,
    ...protocolMeta,
  });
};

export const openProtocolAction = (protocol, meta) => ({
  type: OPEN_PROTOCOL,
  protocol,
  meta,
});

export const protocolLoadedAction = meta => ({
  type: PROTOCOL_LOADED,
  meta,
});

export const saveComplete = () => ({ type: SAVE_COMPLETE });

const saveProtocolThunk = () =>
  (dispatch, getState) => {
    const state = getState();
    const activeProtocol = state.session.activeProtocol;
    const protocol = getProtocol(state);

    saveProtocol(activeProtocol, protocol)
      .then(() => dispatch(saveComplete()));
  };

const openProtocolThunk = protocolMeta =>
  (dispatch) => {
    const protocolData = loadProtocolData(protocolMeta.workingPath);

    dispatch(openProtocolAction(protocolData, protocolMeta));
  };

const loadProtocolThunk = filePath =>
  (dispatch, getState) => {
    const { protocols } = getState();

    const protocolMeta = isNetcanvasFile(filePath) ?
      metaFromNetcanvasFile(protocols, filePath) :
      metaFromWorkingPath(protocols, filePath);

    return prepareWorkingCopy(protocolMeta)
      .then((metaWithWorkingCopy) => {
        dispatch(protocolLoadedAction(metaWithWorkingCopy));
        dispatch(openProtocolThunk(metaWithWorkingCopy));
      });
  };

const actionCreators = {
  saveProtocol: saveProtocolThunk,
  openProtocol: openProtocolThunk,
  loadProtocol: loadProtocolThunk,
};

const actionTypes = {
  SAVE_COMPLETE,
  OPEN_PROTOCOL,
  PROTOCOL_LOADED,
  LOAD_PROTOCOL_ERROR,
  OPEN_PROTOCOL_ERROR,
};

export {
  actionCreators,
  actionTypes,
};
