import React from 'react';
import { Button } from '@codaco/ui';
import { appVersion } from '@app/utils/appVersion';
import { motion, AnimatePresence } from 'framer-motion';
import Section from './Section';
import Group from './Group';
import useAppState from './useAppState';
import ButtonStack from './ButtonStack';
import ExternalLink, { openExternalLink } from '../ExternalLink';

const WhatsNew = () => {
  const [dismissedVersion, setDismissedVersion] = useAppState('dismissedVersion');

  const handleDismiss = () => {
    setDismissedVersion(appVersion);
  };

  const isDismissed = dismissedVersion === appVersion;

  return (
    <AnimatePresence>
      { !isDismissed
        && (
          <motion.div exit={{ opacity: 0, height: 0 }}>
            <Section>
              <Group color="cerulean-blue" className="release-notes" icon="info" tada>
                <h2>
                  Whats new in
                  {appVersion}
                </h2>

                <p>
                  This is a small bug fix release that resolves an issue identified
                  with newly created protocols in version 5.1.0. New protocols were
                  incorrectly being created with the older schema version 2.
                </p>

                <h3>Known Issues</h3>

                <ul>
                  <li>
                    When a select box is open, it is possible to scroll the body
                    of the page, which causes the select items to detach from the box.

                    <ul>
                      <li>
                        Strategies for mediation: Avoid scrolling the main
                        page while a select item is open.
                      </li>
                      <li>
                        Long term resolution: Block body scrolling or adjust select
                        children position relative to body scroll
                        (
                        <ExternalLink href="https://github.com/complexdatacollective/Architect/issues/155">#155</ExternalLink>
                        )
                      </li>
                    </ul>
                  </li>
                </ul>

                <ButtonStack>
                  <Button color="sea-serpent" onClick={handleDismiss}>Dismiss</Button>
                  <Button color="platinum" onClick={() => openExternalLink('https://github.com/complexdatacollective/Architect/releases')}>View full release notes</Button>
                </ButtonStack>
              </Group>
            </Section>
          </motion.div>
        )}
    </AnimatePresence>
  );
};

export default WhatsNew;
