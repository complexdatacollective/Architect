import React from 'react';
import { motion, AnimateSharedLayout } from 'framer-motion';
import WelcomeHeader from './WelcomeHeader';
import Tips from './Tips';
import UpdateAvailable from './UpdateAvailable';
import WhatsNew from './WhatsNew';
import LaunchPad from './LaunchPad';

const variants = {
  initial: {
  },
  animate: {
    delay: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.2,
    },
  },
};

const Home = () => (
  <motion.div
    className="home"
  >
    <AnimateSharedLayout>
      <motion.div
        className="home__container"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <WelcomeHeader />
        <UpdateAvailable />
        <WhatsNew />
        <LaunchPad />
        <Tips />
      </motion.div>
    </AnimateSharedLayout>
  </motion.div>
);

export default Home;
