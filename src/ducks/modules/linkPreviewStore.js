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
      console.log(action);
      previewStore.dispatch(previewActions.loadPreview(action.protocol))
    }),
    mapTo(() => { type: 'LINKED_PREVIEW_STORE'}),
  );

const epics = combineEpics(
  loadPreviewEpic,
);

export default epics;
