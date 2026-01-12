import React from 'react';
import { motion } from 'framer-motion';
import WelcomeHeader from './WelcomeHeader';
import LaunchPad from './LaunchPad';

const variants = {
  show: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: 'beforeChildren',
      staggerChildren: 0.2,
    },
  },
  hide: {
    opacity: 0,
  },
};

const Home = () => (
  <div className="home">
    <motion.div
      className="home__container"
      variants={variants}
      key="start-screen"
    >
      <WelcomeHeader />
      <LaunchPad />
    </motion.div>
  </div>
);

export default Home;
