import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { motion } from 'framer-motion';
import { get } from 'lodash';
import { Button, Icon } from '@codaco/ui';
import { actionCreators as protocolsActions } from '@modules/protocols';
import architectIcon from '@app/images/architect-logo-icon.svg';
import networkCanvasLogo from '@app/images/network-canvas-brand.svg';
import Version from '../Version';

const getRecentProtocols = state =>
  get(state, 'recentProtocols', [])
    .slice(0, 1);

const splashDuration = 0.5;

const splashVariants = {
  animate: {
    scale: 1,
    translateX: '-50%',
    translateY: '0vh',
  },
  initial: {
    scale: 2,
    translateY: '30vh',
    translateX: '-50%',
  },
};

const mainVariants = {
  hide: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delay: splashDuration,
      duration: 1,
      staggerChildren: 0.2,
      when: 'beforeChildren',
    },
  },
};

const sectionVariants = {
  hide: { opacity: 0, translateX: '50%' },
  show: {
    opacity: 1, translateX: 0,
  },
};

const states = {
  BUSY: Symbol('BUSY'),
  READY: Symbol('READY'),
};

const Home = ({
  openProtocol,
  createAndLoadProtocol,
}) => {
  const [state, setState] = useState(states.READY);

  const handleOpenProtocol = useCallback(() => {
    setState(states.BUSY);
    openProtocol().finally(() => setState(states.READY));
  }, [openProtocol, setState]);

  const handleCreateProtocol = useCallback(() => {
    setState(states.BUSY);
    createAndLoadProtocol().finally(() => setState(states.READY));
  }, [createAndLoadProtocol, setState]);

  const disableButtons = state !== states.READY;

  return (
    <motion.div className="home">
      <motion.div
        className="home__main"
        initial="hide"
        animate="show"
        variants={mainVariants}
      >
        <motion.div
          className="home-section"
          variants={sectionVariants}
        >
          <div className="home-section__main">
            <h1>Welcome</h1>
            <h3>Some info about the project goes here</h3>
            <p>Welcome to Network Canvas Architect! To get started, use the buttons above to
              create a new interview protocol, or open an existing one from elsewhere. When you
              return to this screen later, recent protocols you have opened will be shown here.</p>
            <div className="aspect-ratio">
              <img src="https://placehold.it/160x80" alt="foo" />
            </div>

            <label htmlFor="showOnStartup" className="home-section__toggle-panel">
              <input type="checkbox" id="showOnStartup" checked="checked" /> Show on startup
            </label>
          </div>
          <div className="home-section__sub">
            <h1>Further reading</h1>
            <ul>
              <li>Read through <a href="">the tutorials</a></li>
              <li>Find out more in <a href="">the documentation</a></li>
              <li>See what has changed in <a href="">the release notes</a></li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          className="home-section"
          variants={sectionVariants}
        >
          <div className="home-section__main">
            <h1>Start a new protocol</h1>
            <Button
              size="large"
              onClick={handleCreateProtocol}
              disabled={disableButtons}
            >Create a new protocol</Button>
          </div>
        </motion.div>

        <motion.div
          className="home-section"
          variants={sectionVariants}
        >
          <div className="home-section__main">
            <h1>Edit an existing protocol</h1>
            <h4>Resume editing...</h4>
            <div className="protocol-card">
              <div className="protocol-card__icon-section">
                <div className="protocol-icon" />
                <div className="protocol-meta">
                  <h6>Installed: </h6>
                  <h6>Last Modified: 26 June 2020, 10:28</h6>
                  <h6>Schema Version: 4</h6>
                </div>
              </div>
              <div className="protocol-card__main-section">
                <h2 className="protocol-name">NetworkResolver</h2>
                <div className="scrollable protocol-description">net resolver</div>
              </div>
            </div>
          </div>
          <div className="home-section__sub">
            <h4>Choose another protocol</h4>
            <Button
              size="large"
              onClick={handleOpenProtocol}
              disabled={disableButtons}
            >Open from computer</Button>
          </div>
        </motion.div>

        <motion.div
          className="home-section"
          variants={sectionVariants}
        >
          <div className="home-section__main">
            <h1>Edit an existing protocol</h1>
            <Button
              size="large"
              onClick={handleOpenProtocol}
              disabled={disableButtons}
            >Open from computer</Button>
          </div>
        </motion.div>

      </motion.div>

      <motion.div
        variants={splashVariants}
        transition={{ delay: splashDuration, duration: 1 }}
        initial="initial"
        animate="animate"
        className="home__splash"
      >
        <div className="home__splash-logo">
          <img className="home__splash-logo-icon" src={architectIcon} alt="Architect" />
          <div className="home__splash-logo-text">Architect</div>
          <Version />
        </div>
        <motion.div
          style={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: splashDuration, duration: 1 }}
          className="home__splash-tag"
        >
          A tool for creating Network Canvas interviews
        </motion.div>
      </motion.div>

      <motion.div className="home__project">
        <img className="home__project-logo" src={networkCanvasLogo} alt="Network Canvas" />
      </motion.div>
    </motion.div>
  );
};

Home.propTypes = {
  openProtocol: PropTypes.func.isRequired,
  createAndLoadProtocol: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  recentProtocols: getRecentProtocols(state),
});

const mapDispatchToProps = {
  createAndLoadProtocol: protocolsActions.createAndLoadProtocol,
  openProtocol: protocolsActions.openProtocol,
};

const withState = connect(mapStateToProps, mapDispatchToProps);

export { Home };

export default withState(Home);
