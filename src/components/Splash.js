import React from 'react';
import { motion } from 'framer-motion';
import Version from '@components/Version';
import architectIcon from '@app/images/architect-logo-icon.svg';
import networkCanvasLogo from '@app/images/NC-Mark.svg';

const Splash = () => (
  <motion.div>
    <motion.div
      className="home__splash"
    >
      <div className="home__splash-logo">
        <img className="home__splash-logo-icon" src={architectIcon} alt="Architect" />
        <div className="home__splash-logo-text">Architect</div>
        <Version />
      </div>
      <motion.div
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

export default Splash;
