import { exportProtocol } from '../../../other/protocols';
import { getProtocol } from '../../../selectors/protocol';

const EXPORT_COMPLETE = Symbol('PROTOCOL/EXPORT_COMPLETE');

const exportComplete = () => ({ type: EXPORT_COMPLETE });

const exportProtocolAction = () =>
  (dispatch, getState) => {
    const protocol = getProtocol(getState());
    exportProtocol(protocol)
      .then(() => dispatch(exportComplete()));
  };

const actionCreators = {
  exportProtocol: exportProtocolAction,
  exportComplete,
};

const actionTypes = {
  EXPORT_COMPLETE,
};

export {
  actionCreators,
  actionTypes,
};
