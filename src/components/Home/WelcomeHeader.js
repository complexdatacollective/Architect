import React from 'react';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@codaco/ui';
import networkCanvasLogo from '@app/images/NC-Mark.svg';
import headerGraphic from '@app/images/Arc-Flat.svg';
import Version from '@components/Version';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actionCreators as userActions } from '../../ducks/modules/userActions/userActions';
import Group from './Group';
import Switch from './Switch';
import useAppState from './useAppState';
import { openExternalLink } from '../ExternalLink';
import Section from './Section';

const WelcomeHeader = ({
  downloadProtocolFromURI
}) => {
  const [isOpen, setIsOpen] = useAppState('showWelcome', true);

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
          { isOpen && (
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
                    If you are new to the software, please consider watching the overview
                    video to the left. It will explain how the software works, and introduce
                    all the essential skills needed to build an interview protocol. We also
                    have extensive tutorials and information on a range of topics on our
                    documentation website, which you can visit using the link below.
                  </p>
                  <p>
                    Alternatively, to get started right away use the buttons below to
                    create a new interview protocol, or open an existing one from elsewhere.
                  </p>
                  <div className="welcome-actions">
                    <Button
                      color="primary"
                      onClick={() => openExternalLink('https://www.youtube.com/watch?v=XzfE6j-LnII')}
                    >
                      Watch overview video
                    </Button>
                    <Button
                      color="sea-serpent"
                      onClick={() => openExternalLink('https://documentation.networkcanvas.com')}
                    >
                      Visit documentation website
                    </Button>
                    <Button
                      color="mustard"
                      onClick={() => downloadProtocolFromURI('https://documentation.networkcanvas.com/protocols/Sample%20Protocol%20v3.netcanvas')}
                    >
                      Install Sample Protocol
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

WelcomeHeader.PropTypes = {
  downloadProtocolFromURI: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  downloadProtocolFromURI: userActions.downloadProtocolFromURI
};

const withState = connect(null, mapDispatchToProps);

export default withState(WelcomeHeader);
