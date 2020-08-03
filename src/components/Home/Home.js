import React from 'react';
import { motion, AnimateSharedLayout } from 'framer-motion';
import Header from './Header';
import UpdateAvailable from './UpdateAvailable';
import WhatsNew from './WhatsNew';
import LaunchPad from './LaunchPad';
import RecentlyEdited from './RecentlyEdited';

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
        <Header />
        <UpdateAvailable />
        <WhatsNew />
        <LaunchPad />
        <RecentlyEdited />
      </motion.div>
    </AnimateSharedLayout>
  </motion.div>
);

export default Home;
