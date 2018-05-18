import uuid from 'uuid';
import path from 'path';
import { has } from 'lodash';
import { openProtocol, saveProtocol, loadProtocolData } from '../../../other/protocols';
import { getProtocol } from '../../../selectors/protocol';

const OPEN_PROTOCOL = Symbol('PROTOCOL/OPEN');
const PROTOCOL_LOADED = Symbol('PROTOCOL/LOADED');
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

const saveComplete = () => ({ type: SAVE_COMPLETE });

const saveProtocolAction = () =>
  (dispatch, getState) => {
    const state = getState();
    const activeProtocol = state.session.activeProtocol;
    const protocol = getProtocol(state);
    saveProtocol(activeProtocol, protocol)
      .then(() => dispatch(saveComplete()));
  };

const openProtocolAction = protocolMeta =>
  (dispatch) => {
    const protocolData = loadProtocolData(protocolMeta.workingPath);

    dispatch({
      type: OPEN_PROTOCOL,
      protocol: protocolData,
      meta: protocolMeta,
    });
  };

const loadProtocolAction = filePath =>
  (dispatch, getState) => {
    const { protocols } = getState();

    const protocolMeta = isNetcanvasFile(filePath) ?
      metaFromNetcanvasFile(protocols, filePath) :
      metaFromWorkingPath(protocols, filePath);

    return prepareWorkingCopy(protocolMeta)
      .then((metaWithWorkingCopy) => {
        dispatch({
          type: PROTOCOL_LOADED,
          meta: metaWithWorkingCopy,
        });

        dispatch(openProtocolAction(metaWithWorkingCopy));
      });
  };

const actionCreators = {
  saveProtocol: saveProtocolAction,
  openProtocol: openProtocolAction,
  loadProtocol: loadProtocolAction,
};

const actionTypes = {
  SAVE_COMPLETE,
  OPEN_PROTOCOL,
  PROTOCOL_LOADED,
};

export {
  actionCreators,
  actionTypes,
};
