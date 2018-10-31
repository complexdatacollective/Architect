import { combineEpics } from 'redux-observable';
import { filter, tap, mapTo } from 'rxjs/operators';
import previewStore from '../previewStore';
import { actionTypes as loadActionTypes } from './protocols/load';
import { actionCreators as previewActions } from './preview';

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
