import React from 'react';
import { AnimateSharedLayout, motion } from 'framer-motion';
import WelcomeHeader from './WelcomeHeader';
import LaunchPad from './LaunchPad';

const variants = {
  show: {
    opacity: 1,
  },
  hide: {
    opacity: 0,
  },
};

const Home = () => (
  <div className="home">
    <AnimateSharedLayout>
      <motion.div
        className="home__container"
        variants={variants}
        key="start-screen"
      >
        <WelcomeHeader />
        <LaunchPad />
      </motion.div>
    </AnimateSharedLayout>
  </div>
);

export default Home;
