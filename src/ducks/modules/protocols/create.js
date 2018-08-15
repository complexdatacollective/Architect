import { createProtocol } from '../../../other/protocols';
import history from '../../../history';

const createProtocolAction = () =>
  () =>
    createProtocol()
      .then(
        ({ id }) => {
          history.push(`/edit/${encodeURIComponent(id)}`);
        },
      );

const actionCreators = {
  createProtocol: createProtocolAction,
};

const actionTypes = {
};

export {
  actionCreators,
  actionTypes,
};

