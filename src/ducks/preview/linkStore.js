import { combineEpics } from 'redux-observable';
import { filter, tap, mapTo } from 'rxjs/operators';
import previewStore from '../previewStore';
import { actionTypes as loadActionTypes } from '../modules/protocols/load';
import { actionCreators as previewActions } from './preview';

/**
 * When we load a protocol in Architect, automatically load it into the preview state.
 * This is only used for debugging the preview view, normally preview state is loaded
 * via ipc.
 */
const loadPreviewEpic = action$ =>
  action$.pipe(
    // // onloadsucess,
    filter(({ type }) => type === loadActionTypes.LOAD_PROTOCOL_SUCCESS),
    // update state with loadpreview
    tap((action) => {
      previewStore.dispatch(previewActions.setProtocol({ path: '', protocol: action.protocol }));
    }),
    mapTo(() => ({ type: 'PREVIEW/LINKED_PREVIEW_STORE' })),
  );

const epics = combineEpics(
  loadPreviewEpic,
);

export default epics;
