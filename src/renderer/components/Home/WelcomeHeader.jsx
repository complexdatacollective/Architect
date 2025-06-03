import React from 'react';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@codaco/ui';
import { useDispatch } from 'react-redux';
import networkCanvasLogo from '@app/images/NC-Mark.svg';
import headerGraphic from '@app/images/Arc-Flat.svg';
import Version from '@components/Version';
import { actionCreators as userActions } from '../../ducks/modules/userActions/userActions';
import Group from './Group';
import Switch from './Switch';
import useAppState from './useAppState';
import { openExternalLink } from '../ExternalLink';
import Section from './Section';

const WelcomeHeader = () => {
  const [isOpen, setIsOpen] = useAppState('showWelcome', true);

  const dispatch = useDispatch();
  const downloadSampleProtocol = () => dispatch(userActions.importSampleProtocol());

  const classes = cx(
    'home-section',
    'welcome-header',
    { 'welcome-header--is-open': isOpen },
  );

  const start = {
    show: {
      opacity: 1,
      height: '100%',
      transition: {
        stiffness: 100,
        dampening: 10,
      },
    },
    hide: {
      opacity: 0,
      height: '0px',
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Section
      className={classes}
    >
      <Group className="welcome-header__header">
        <img className="logo" src={headerGraphic} alt="Network Canvas Architect" />
        <div className="welcome-header__title">
          <div className="project-tag">
            <img src={networkCanvasLogo} alt="A Network Canvas project" style={{ height: '2.4rem', width: '2.4rem' }} />
            <h5>Network Canvas</h5>
          </div>
          <h1>Architect</h1>
          <p>A tool for building Network Canvas Interviews</p>
        </div>
        <Version />
        <Switch
          className="welcome-header__header-toggle"
          label="Show welcome"
          on={isOpen}
          onChange={() => setIsOpen(!isOpen)}
        />
      </Group>
      <motion.section
        className="welcome-header__panel"
      >
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              variants={start}
              initial="hide"
              animate="show"
              exit="hide"
            >
              <Group
                className="home-welcome"
              >
                <div className="home-welcome__content">
                  <h2>Welcome to Architect!</h2>
                  <p>
                    Architect is a tool for building Network Canvas interviews. To learn more about
                    the software, and how to use it, please visit the documentation website.
                  </p>
                  <p>
                    If you encounter any issues, or have any questions, please visit our user
                    community, where we will be happy to help.
                  </p>
                  <div className="welcome-actions">
                    <Button
                      className="button button--cerulean-blue button--with-new"
                      color="cerulean-blue"
                      onClick={() => openExternalLink('https://community.networkcanvas.com')}
                    >
                      Community Website
                    </Button>
                    {/* <Button
                      color="primary"
                      onClick={() => openExternalLink('https://www.youtube.com/watch?v=XzfE6j-LnII')}
                    >
                      Watch overview video
                    </Button> */}
                    <Button
                      color="sea-serpent"
                      onClick={() => openExternalLink('https://documentation.networkcanvas.com')}
                    >
                      Documentation website
                    </Button>
                    <Button
                      color="mustard"
                      onClick={downloadSampleProtocol}
                    >
                      Download Sample Protocol
                    </Button>
                  </div>
                </div>
              </Group>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </Section>
  );
};

export default WelcomeHeader;
