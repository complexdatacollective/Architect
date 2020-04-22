import React from 'react';
import { motion } from 'framer-motion';
import { Spinner } from '@codaco/ui';

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.5 } },
};

const Loading = () => (
  <motion.div
    className="scene__loading"
    style={{
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 'var(--z-modal)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 1)',
    }}
    initial="hidden"
    animate="visible"
    exit="hidden"
    variants={variants}
  >
    <Spinner />
  </motion.div>
);

export default Loading;
