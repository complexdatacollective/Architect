import React from 'react';
import { Button } from '@codaco/ui';
import { appVersion } from '@app/utils/appVersion';
import { AnimatePresence } from 'framer-motion';
import Section from './Section';
import Group from './Group';
import useAppState from './useAppState';
import ButtonStack from './ButtonStack';

const WhatsNew = () => {
  const [dismissedVersion, setDismissedVersion] = useAppState('dismissedVersion');

  const handleDismiss = () => {
    setDismissedVersion(appVersion);
  };

  const isDismissed = dismissedVersion === appVersion;

  return (
    <AnimatePresence>
      { !isDismissed &&
        <Section>
          <Group color="cerulean-blue" className="release-notes" icon="info" tada>
            <h2>Whats new in {appVersion}</h2>

            <p>
              This is a small bug fix release that resolves an issue identified
              with newly created protocols in version 5.1.0. New protocols were
              incorrectly being created with the older schema version 2.</p>

            <h3>Known Issues</h3>

            <ul>
              <li>
                When a select box is open, it is possible to scroll the body
                of the page, which causes the select items to detach from the box.

                <ul>
                  <li>Strategies for mediation: Avoid scrolling the main
                    page while a select item is open.</li>
                  <li>Long term resolution: Block body scrolling or adjust select children position
                    relative to body scroll
                    (<a href="https://github.com/codaco/Architect/issues/155">#155</a>)</li>
                </ul>
              </li>
            </ul>

            <ButtonStack>
              <Button size="small" color="sea-serpent" onClick={handleDismiss} >Dismiss</Button>
              <Button size="small" color="platinum" onClick={handleDismiss} >View full release notes</Button>
            </ButtonStack>
          </Group>
        </Section>
      }
    </AnimatePresence>
  );
};

export default WhatsNew;
