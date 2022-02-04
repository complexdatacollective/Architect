import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
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
    threshold = 115,
    collapsedState,
  } = props;

  const { scrollY: currentOffset } = useContext(ScreenContext);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (currentOffset > threshold) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  },
  [currentOffset]);

  return (
    <>
      <motion.div
        key="expanded-state"
      >
        {children}
      </motion.div>
      <AnimatePresence>
        {isCollapsed
          && (
          <motion.div
            key="collapsed-state"
            style={{
              position: 'absolute',
              top: 0,
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
      </AnimatePresence>
    </>
  );
};

CollapsableHeader.propTypes = {
  children: PropTypes.node.isRequired,
  threshold: PropTypes.number,
  collapsedState: PropTypes.node.isRequired,
};

CollapsableHeader.defaultProps = {
  threshold: 115,
};

export default CollapsableHeader;
