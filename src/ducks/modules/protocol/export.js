import 'rxjs/add/operator/mergeMap'; // Each rx operator has to be manually imported
import 'rxjs/add/operator/do'; // Each rx operator has to be manually imported
import { exporter } from '../../../other/protocols';
import { getProtocol } from '../../../selectors/protocol';

const EXPORT_PROTOCOL = Symbol('PROTOCOL/EXPORT');
const EXPORT_COMPLETE = Symbol('PROTOCOL/EXPORT_COMPLETE');

const exportProtocol = () => ({ type: EXPORT_PROTOCOL });
const exportComplete = () => ({ type: EXPORT_COMPLETE });

const epics = (action$, store) =>
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

export {
  actionCreators,
  actionTypes,
  epics,
};
