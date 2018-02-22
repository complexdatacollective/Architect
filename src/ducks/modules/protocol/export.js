import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import { exporter, create } from '../../../other/protocols';
import { getProtocol } from '../../../selectors/protocol';
import { actionCreators as protocolsActions } from '../protocols';

const EXPORT_PROTOCOL = Symbol('PROTOCOL/EXPORT');
const EXPORT_COMPLETE = Symbol('PROTOCOL/EXPORT_COMPLETE');

const exportProtocol = () => ({ type: EXPORT_PROTOCOL });
const exportComplete = () => ({ type: EXPORT_COMPLETE });

const exportProtocolEpic = (action$, store) =>
  action$.ofType(EXPORT_PROTOCOL)
    .mergeMap(() => {
      const protocol = getProtocol(store.getState());
      return exporter(protocol).then(() => exportComplete());
    });

const actionCreators = {
  exportProtocol,
  exportComplete,
};

const actionTypes = {
  EXPORT_PROTOCOL,
  EXPORT_COMPLETE,
};

const epics = combineEpics(
  exportProtocolEpic,
);

export {
  actionCreators,
  actionTypes,
  epics,
};
