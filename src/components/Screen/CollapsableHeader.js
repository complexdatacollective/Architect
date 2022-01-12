import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion/dist/framer-motion';
import { ScreenContext } from './Screen';

const variants = {
  collapsed: {
    opacity: 0,
    y: '-100%',
  },
  expanded: {
    opacity: 1,
    y: 0,
    transition: {
      stiffness: 300,
      damping: 30,
    },
  },
};

const CollapsableHeader = (props) => {
  const {
    children,
    threshold = 60,
    collapsedState,
  } = props;

  const { scrollY: currentOffset } = useContext(ScreenContext);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    console.log('screen context', currentOffset);
    if (currentOffset > threshold) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  },
  [currentOffset]);

  return (
    <AnimatePresence>
      {isCollapsed
        && (
        <motion.div
          key="collapsed-state"
          style={{
            position: 'fixed',
            width: '100%',
            zIndex: 'var(--z-panel)',
          }}
          variants={variants}
          initial="collapsed"
          animate="expanded"
          exit="collapsed"
        >
          {collapsedState}
        </motion.div>
        )}
      <motion.div
        key="expanded-state"
        variants={variants}
        initial="collapsed"
        animate="expanded"
        exit="collapsed"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default CollapsableHeader;
