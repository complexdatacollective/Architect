import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import UpdateAvailable from './UpdateAvailable';
import WhatsNew from './WhatsNew';
import LaunchPad from './LaunchPad';
import RecentlyEdited from './RecentlyEdited';

const Home = () => (
  <motion.div
    className="home"
    initial="initial"
    animate="enter"
  >
    <motion.div
      className="home__container"
    >
      <Header />
      <UpdateAvailable />
      <WhatsNew />
      <LaunchPad />
      <RecentlyEdited />
    </motion.div>
  </motion.div>
);

export default Home;
