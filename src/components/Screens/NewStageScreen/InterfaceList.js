import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion/dist/framer-motion';
import Interface from './Interface';
import { PropTypes as InterfacePropTypes } from './interfaceOptions';

const animations = {
  show: { opacity: 1 },
  hide: { opacity: 0 },
};

const InterfaceList = ({
  items,
  onSelect,
}) => (
  <motion.div className="new-stage-screen__interfaces" layout>
    <AnimatePresence>
      {items.map(({ type: interfaceType }) => (
        <motion.div
          className="new-stage-screen__interface-container"
          variants={animations}
          initial="hide"
          exit="hide"
          animate="show"
          key={interfaceType}
          layout
        >
          <Interface
            type={interfaceType}
            onClick={onSelect}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  </motion.div>
);

InterfaceList.propTypes = {
  items: PropTypes.arrayOf(InterfacePropTypes.interface),
  onSelect: PropTypes.func.isRequired,
};

InterfaceList.defaultProps = {
  items: [],
};

export default InterfaceList;
