import React from 'react';
import { Spinner, ProgressBar } from '@codaco/ui';
import { actionCreators as toastActions } from '@modules/toasts';

export const createImportToast = (toastUUID, handleCancel) => (dispatch) => {
  // Create a toast to show the status as it updates
  dispatch(toastActions.addToast({
    id: toastUUID,
    type: 'info',
    title: 'Downloading Protocol...',
    CustomIcon: (<Spinner small />),
    autoDismiss: false,
    dismissHandler: handleCancel,
    content: (<ProgressBar orientation="horizontal" percentProgress={0} />),
  }));
};

export const updateDownloadProgress = (toastUUID, progress) => (dispatch) => {
  dispatch(toastActions.updateToast(toastUUID, {
    content: (<ProgressBar orientation="horizontal" percentProgress={progress} />),
  }));
};
