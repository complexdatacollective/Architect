import React, { useState, useEffect } from 'react';
import xss from 'xss';
import { Button } from '@codaco/ui';
import Section from './Section';
import Group from './Group';

const { autoUpdater } = require('electron').remote.require('electron-updater');

const intitialState = {
  version: null,
  notes: null,
};

const xssOptions = {
  whiteList: {
    // Omitting h1 is a gnarly way of stripping the main header,
    // which we don't want in this case.
    // h1: [],
    h2: [],
    p: [],
    ul: [],
    ol: [],
    li: [],
    a: ['href'],
    hr: [],
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: true,
};

const handleUpdate = () => {
  autoUpdater.downloadUpdate();
};

const ReleaseNotes = () => {
  const [{ version, notes }, setUpdateInfo] = useState(intitialState);

  useEffect(() => {
    autoUpdater.on('update-available', (info) => {
      setUpdateInfo({
        version: info.version,
        notes: xss(info.releaseNotes, xssOptions),
      });
    });

    autoUpdater.checkForUpdates(true);

    setTimeout(() => {
      setUpdateInfo({
        version: 123,
        notes: 'not an update',
      });
    }, 3000);
  }, []);

  const handleDismiss = () => {
  };

  return (
    version &&
    <Section key="update-available">
      <Group color="cerulean-blue" className="release-notes" icon="info">
        <h2>A new version is available! {version}</h2>
        <div dangerouslySetInnerHTML={{ __html: notes }} />
        <p>
          <Button size="small" color="sea-serpent" onClick={handleDismiss} >Dismiss</Button>
          <Button size="small" color="platinum" onClick={handleUpdate} >Download and Restart</Button>
        </p>
      </Group>
    </Section>
  );
};

export default ReleaseNotes;
