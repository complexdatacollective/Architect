import React from 'react';
import { motion } from 'framer-motion';
import { find } from 'lodash';
import interfaceTypes from './interfaceTypes';

const Interface = ({
  id,
}) => {
  if (!id) { return null; }

  const meta = find(interfaceTypes, ['id', id]);

  if (!meta) {
    throw Error(`${id} definition not found`);
  }

  return (
    <motion.div className="stage-type-selector__interface">
      <h1>{ meta.name }</h1>
      { meta.category }
    </motion.div>
  );
};

export default Interface;
