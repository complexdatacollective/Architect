import log from 'electron-log';
import { getActiveProtocolMeta } from '@selectors/protocols';
import { getProtocol } from '@selectors/protocol';
import prune from '@app/utils/prune';
import { actionCreators as protocolActions } from '../protocol';

const PREFLIGHT = 'PROTOCOLS/PREFLIGHT';
const PREFLIGHT_ERROR = 'PROTOCOLS/PREFLIGHT_ERROR';

const preflight = () => ({ type: PREFLIGHT });

const preflightError = error => ({
  type: PREFLIGHT_ERROR,
  error,
});

const preflightThunk = () =>
  (dispatch, getState) =>
    new Promise((resolve, reject) => {
      log.debug('preflight action()');
      const state = getState();
      const meta = getActiveProtocolMeta(state);
      const protocol = getProtocol(state);

      if (!meta) {
        resolve(dispatch(preflightError('No active protocol found')));
      }

      try {
        dispatch(preflight());

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
