import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { get } from 'lodash';
import { Button } from '@codaco/ui';
import { actionCreators as protocolsActions } from '@modules/protocols';
import architectIcon from '@app/images/architect-logo-icon.svg';
import networkCanvasLogo from '@app/images/network-canvas-brand.svg';
import Version from '@components/Version';

const getRecentProtocols = state =>
  get(state, 'recentProtocols', [])
    .slice(0, 1);

const splashDuration = 1.5;

const splashVariants = {
  appStartInitial: {
    scale: 2,
    translateY: '30vh',
    translateX: '-50%',
  },
  initial: {
    opacity: 0,
    translateX: '-50%',
    translateY: '0vh',
  },
  enter: {
    scale: 1,
    opacity: 1,
    translateX: '-50%',
    translateY: '0vh',
  },
  appStartEnter: {
    scale: 1,
    opacity: 1,
    translateX: '-50%',
    translateY: '0vh',
    transition: { delay: 0.5, duration: 1 },
  },
};

const taglineVariants = {
  appStartInitial: {
    opacity: 1,
  },
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 0,
  },
  appStartEnter: {
    opacity: 0,
  },
};

const mainVariants = {
  appStartInitial: { opacity: 0 },
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: {
      duration: 0,
      delay: 0.5,
      staggerChildren: 0.5,
      when: 'beforeChildren',
    },
  },
  appStartEnter: {
    opacity: 1,
    transition: {
      duration: 0,
      delay: splashDuration,
      staggerChildren: 0.5,
      when: 'beforeChildren',
    },
  },
};

const sectionVariants = {
  initial: { opacity: 0, translateX: '50%' },
  appStartInitial: { opacity: 0, translateX: '50%' },
  enter: {
    opacity: 1,
    translateX: 0,
  },
  appStartEnter: {
    opacity: 1,
    translateX: 0,
  },
};

const states = {
  BUSY: Symbol('BUSY'),
  READY: Symbol('READY'),
};

const Home = ({
  openProtocol,
  createAndLoadProtocol,
  resumeProtocol,
  unbundleAndLoadProtocol,
}) => {
  const [state, setState] = useState(states.READY);
  const history = useHistory();

  const isAppStart = history.length === 1;

  const handleOpenProtocol = useCallback(() => {
    setState(states.BUSY);
    openProtocol().finally(() => setState(states.READY));
  }, [openProtocol, setState]);

  const handleCreateProtocol = useCallback(() => {
    setState(states.BUSY);
    createAndLoadProtocol().finally(() => setState(states.READY));
  }, [createAndLoadProtocol, setState]);

  const handleLoadProtocol = useCallback((filePath) => {
    setState(states.BUSY);
    unbundleAndLoadProtocol(filePath).finally(() => setState(states.READY));
  }, [unbundleAndLoadProtocol, setState]);

  const disableButtons = state !== states.READY;

  const initial = isAppStart ? 'appStartInitial' : 'initial';
  const animate = isAppStart ? 'appStartEnter' : 'enter';

  return (
    <motion.div
      className="home"
      initial={initial}
      animate={animate}
    >
      <motion.div
        className="home__main"
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
            <div className="protocol-card" onClick={() => handleLoadProtocol(resumeProtocol.filePath)}>
              <div className="protocol-card__icon-section">
                <div className="protocol-icon" />
                <div className="protocol-meta">
                  <h6>Last Modified: {resumeProtocol.lastModified} {/* 26 June 2020, 10:28 */}</h6>
                  <h6>Schema Version: {resumeProtocol.schemaVersion}</h6>
                </div>
              </div>
              <div className="protocol-card__main-section">
                <h2 className="protocol-name">{resumeProtocol.name}</h2>
                <div className="scrollable protocol-description">{resumeProtocol.description}</div>
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
        className="home__splash"
      >
        <div className="home__splash-logo">
          <img className="home__splash-logo-icon" src={architectIcon} alt="Architect" />
          <div className="home__splash-logo-text">Architect</div>
          <Version />
        </div>
        <motion.div
          variants={taglineVariants}
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
  unbundleAndLoadProtocol: PropTypes.func.isRequired,
  resumeProtocol: PropTypes.object,
};

Home.defaultProps = {
  resumeProtocol: null,
};

const mapStateToProps = state => ({
  recentProtocols: getRecentProtocols(state),
  resumeProtocol: getRecentProtocols(state)[0],
});

const mapDispatchToProps = {
  createAndLoadProtocol: protocolsActions.createAndLoadProtocol,
  unbundleAndLoadProtocol: protocolsActions.unbundleAndLoadProtocol,
  openProtocol: protocolsActions.openProtocol,
};

const withState = connect(mapStateToProps, mapDispatchToProps);

export { Home };

export default withState(Home);
