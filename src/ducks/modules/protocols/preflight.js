import log from 'electron-log';
import { getProtocol } from '../../../selectors/protocol';
import { actionCreators as protocolActions } from '../protocol';
import prune from '../../../utils/prune';

const PREFLIGHT = 'PROTOCOLS/PREFLIGHT';

const preflight = () => ({ type: PREFLIGHT });

const preflightThunk = () =>
  (dispatch, getState) =>
    new Promise((resolve, reject) => {
      log.debug('preflight action()');
      const state = getState();
      const protocol = getProtocol(state);
      dispatch(preflight());

      try {
        log.debug('  prune');
        // Remove null and undefined nodes
        const prunedProtocol = prune(protocol);

        log.debug('  convert to json');
        // Simulate the process that the protocol will take in transit
        const protocolJson = JSON.stringify(prunedProtocol);
        const protocolObject = JSON.parse(protocolJson);

        log.debug('  save to state');
        // save changes to state
        resolve(dispatch(protocolActions.setProtocol(null, protocolObject)));
      } catch (e) {
        reject(e);
      }
    });

const actionCreators = {
  preflight: preflightThunk,
};

const actionTypes = {
  PREFLIGHT,
};

export {
  actionCreators,
  actionTypes,
};
