import React from 'react';
import { AnimateSharedLayout, motion } from 'framer-motion';
import WelcomeHeader from './WelcomeHeader';
import Tips from './Tips';
import UpdateAvailable from './UpdateAvailable';
import WhatsNew from './WhatsNew';
import LaunchPad from './LaunchPad';

const variants = {
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.32, when: 'beforeChildren' },
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
        initial="hide"
        animate="show"
        key="start-screen"
        layout
      >
        <WelcomeHeader />
        <UpdateAvailable />
        <WhatsNew />
        <LaunchPad />
        <Tips />
      </motion.div>
    </AnimateSharedLayout>
  </div>
);

export default Home;
