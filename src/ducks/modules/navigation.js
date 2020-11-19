import { getActiveProtocol } from '@selectors/session';
import history from '@app/history';

// TODO: are these used anywhere?

const pathTo = (location, edit = true) =>
  (_, getState) => {
    if (!edit) { return `/${location}`; }
    const state = getState();
    const filePath = getActiveProtocol(state);
    if (!filePath) { return null; }
    return `/edit/${location}`;
  };

/**
 * This is a helper function that uses the state to manipulate the application
 * path. Arguably it shouldn't be in here, since it doesn't manipulate the state.
 * However, as the application path acts like state to all intents and purposes
 * it's been placed here for now. In future we may ditch app routing all together
 * and make it entirely state driven, at which point this is more future proof.
 */
const goTo = (location = '', edit = true) =>
  (dispatch) => {
    const path = dispatch(pathTo(location, edit));
    if (!path) { return; }
    history.push(path);
  };

const goBack = () =>
  () => {
    history.goBack();
  };

const actionCreators = {
  goTo,
  goBack,
  pathTo,
};

const actionTypes = {
};

export {
  actionCreators,
  actionTypes,
};
