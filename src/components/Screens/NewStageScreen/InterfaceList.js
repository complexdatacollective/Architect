import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InterfaceThumbnail from './InterfaceThumbnail';

const animations = {
  show: { opacity: 1 },
  hide: { opacity: 0 },
};

const InterfaceList = ({
  items,
  onClick,
}) => (
  <motion.div className="stage-type-selector__interfaces">
    <AnimatePresence>
      {items.map(({ id }) => (
        <motion.div
          className="stage-type-selector__interface-container"
          variants={animations}
          initial="hide"
          exit="hide"
          animate="show"
          key={id}
          onClick={onClick}
        >
          <InterfaceThumbnail id={id} />
        </motion.div>
      ))}
    </AnimatePresence>
  </motion.div>
);

export default InterfaceList;
