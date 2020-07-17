import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@codaco/ui';
import architectLogoIcon from '@app/images/architect-logo-icon.svg';

const splashDuration = 0;

const splashVariants = {
  animate: {
    scale: 1,
    translateX: '-50%',
    translateY: '0vh',
  },
  initial: {
    scale: 3,
    left: '50%',
    translateY: '30vh',
    translateX: '-50%',
  },
};

const mainVariants = {
  hide: { opacity: 0, translateY: '100%' },
  show: {
    opacity: 1,
    translateY: 0,
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

const Home = () => (
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
          <p>Some info about the project goes here</p>
          <div className="aspect-ratio">
            <img src="https://placehold.it/160x80" alt="foo" />
          </div>
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
          <h1>Resume editing a protocol</h1>
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
          <h4>Resume editing</h4>
        </div>
      </motion.div>

      <motion.div
        className="home-section"
        variants={sectionVariants}
      >
        <div className="home-section__main">
          <h1>Start a new protocol</h1>
          <div className="home-section__start">
            <div className="home-section__start-left">
              <h4>Start new protocol</h4>
              <Button size="large">Create new protocol</Button>
            </div>
          </div>
        </div>
        <div className="home-section__sub">
          <h4>Info about creating a protocol</h4>
        </div>
      </motion.div>

      <motion.div
        className="home-section"
        variants={sectionVariants}
      >
        <div className="home-section__main">
          <h1>Edit an existing protocol</h1>
          <h4>Choose a protocol</h4>
          <Button size="large">Open from computer</Button>
        </div>
        <div className="home-section__sub">
          <h4>Info about editing a protocol</h4>
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
      <img src={architectLogoIcon} alt="" />
      <motion.div
        style={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: splashDuration, duration: 1 }}
        className="home__splash-tag"
      >
        TAG LINE GOES HERE
      </motion.div>
    </motion.div>

    <motion.div className="home__project">project</motion.div>
  </motion.div>
);

export default Home;
