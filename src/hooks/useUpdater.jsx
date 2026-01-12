/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@codaco/ui';
import { find } from 'lodash';
import compareVersions from 'compare-versions';
import { Markdown } from '@codaco/ui/lib/components/Fields';
import { isMacOS, isWindows, isLinux } from '@app/utils/platform';
import { electronAPI } from '@utils/electronBridge';
import { actionCreators as toastActions } from '../ducks/modules/toasts';
import { actionCreators as dialogActions } from '../ducks/modules/dialogs';
import ExternalLink, { openExternalLink } from '../components/ExternalLink';
import useAppState from '../components/Home/useAppState';

// Custom renderer for links so that they open correctly in an external browser
const markdownComponents = {
  // eslint-disable-next-line react/prop-types
  a: ({ children, href }) => <ExternalLink href={href}>{children}</ExternalLink>,
};

export const getPlatformSpecificContent = (assets) => {
  if (!assets || assets.length === 0) {
    return {
      buttonText: 'Open Download Page',
      buttonLink: 'https://networkcanvas.com/download.html',
    };
  }

  if (isMacOS()) {
    const dmg = find(assets, (value) => value.name.split('.').pop() === 'dmg');
    return {
      buttonText: 'Download Installer',
      buttonLink: dmg.browser_download_url,
    };
  }

  if (isWindows()) {
    const exe = find(assets, (value) => value.name.split('.').pop() === 'exe');
    return {
      buttonText: 'Download Installer',
      buttonLink: exe.browser_download_url,
    };
  }

  if (isLinux()) {
    return {
      buttonText: 'Open GitHub Release',
      buttonLink: 'https://github.com/complexdatacollective/Architect/releases/latest',
    };
  }

  return {
    buttonText: 'Open Download Page',
    buttonLink: 'https://networkcanvas.com/download.html',
  };
};

export const checkEndpoint = (updateEndpoint, currentVersion) => fetch(updateEndpoint)
  .then((response) => response.json())
  .then(({ name, body, assets }) => {
    if (compareVersions.compare(currentVersion, name, '<')) {
      return {
        newVersion: name,
        releaseNotes: body,
        releaseButtonContent: getPlatformSpecificContent(assets),
      };
    }
    // eslint-disable-next-line no-console
    console.info(`No update available (current: ${currentVersion}, latest: ${name}).`);
    return false;
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.warn('Error checking for updates:', error);
    // Don't reject, as we don't want to handle this error - just fail silently.
    return Promise.resolve(false);
  });

const useUpdater = (updateEndpoint, timeout = 0) => {
  const dispatch = useDispatch();
  const [dismissedVersion, setDismissedVersion] = useAppState('dismissedVersion');

  const handleDismiss = (version) => {
    setDismissedVersion(version);
    dispatch(toastActions.removeToast('update-toast'));
  };

  const showReleaseNotes = (releaseNotes, releaseButtonContent) => {
    const { buttonText, buttonLink } = releaseButtonContent;

    dispatch(dialogActions.openDialog({
      type: 'Confirm',
      title: 'Release Notes',
      confirmLabel: buttonText,
      onConfirm: () => openExternalLink(buttonLink),
      message: (
        <div className="dialog-release-notes allow-text-selection">
          <p>
            Please read the following release notes carefully, as changes in the software
            may impact which protocols you are able to open in Architect.
          </p>
          <Markdown
            className="dialog-release-notes__notes"
            markdownRenderers={markdownComponents}
            label={releaseNotes}
          />
        </div>
      ),
    }));
  };

  const checkForUpdate = async () => {
    const version = await electronAPI.app.getVersion();
    const updateAvailable = await checkEndpoint(updateEndpoint, version);
    if (!updateAvailable) { return; }

    const {
      newVersion,
      releaseNotes,
      releaseButtonContent,
    } = updateAvailable;

    // Don't notify the user if they have dismissed this version.
    if (dismissedVersion && dismissedVersion.includes(newVersion)) {
      return;
    }

    dispatch(toastActions.addToast({
      id: 'update-toast',
      type: 'info',
      classNames: 'update-available-toast',
      title: `Version ${newVersion} available`,
      autoDismiss: false,
      content: (
        <>
          <p>
            A new version of Architect is available. To
            upgrade, see the link in the release notes.
          </p>
          <div className="toast-button-group">
            <Button color="platinum--dark" onClick={() => handleDismiss(newVersion)}>Hide for this release</Button>
            <Button color="neon-coral" onClick={() => showReleaseNotes(releaseNotes, releaseButtonContent)}>Show Release Notes</Button>
          </div>
        </>
      ),
    }));
  };

  useEffect(() => {
    const delay = setTimeout(checkForUpdate, timeout);

    return () => clearTimeout(delay);
  }, [updateEndpoint, dismissedVersion]);
};

export default useUpdater;
