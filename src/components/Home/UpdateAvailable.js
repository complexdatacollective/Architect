/* eslint-disable react/no-danger */
import React, { useState, useEffect } from 'react';
import xss from 'xss';
import { AnimatePresence } from 'framer-motion';
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
  const [isDismissed, setIsDimissed] = useState(true);
  const [{ version, notes }, setUpdateInfo] = useState(intitialState);

  useEffect(() => {
    autoUpdater.on('update-available', (info) => {
      setUpdateInfo({
        version: info.version,
        notes: xss(info.releaseNotes, xssOptions),
      });
      setIsDimissed(false);
    });

    autoUpdater.checkForUpdates(true);
  }, []);

  const handleDismiss = () => {
    setIsDimissed(true);
  };

  return (
    <AnimatePresence>
      { !isDismissed && version &&
        <Section key="update-available">
          <Group color="cerulean-blue" className="release-notes" icon="info" tada>
            <h2>A new version is available! {version}</h2>
            <div dangerouslySetInnerHTML={{ __html: notes }} />
            <p>
              <Button size="small" color="sea-serpent" onClick={handleDismiss} >Dismiss</Button>
              <Button size="small" color="platinum" onClick={handleUpdate} >Download and Restart</Button>
            </p>
          </Group>
        </Section>
      }
    </AnimatePresence>
  );
};

export default ReleaseNotes;
