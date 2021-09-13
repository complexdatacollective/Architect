import React from 'react';
import { motion } from 'framer-motion';
import { find } from 'lodash';

export const interfaces = [
  {
    id: 'NameGenerator',
    category: 'generator',
    name: 'Name Generator',
  },
  {
    id: 'NameGeneratorRoster',
    category: 'generator',
    name: 'Name Generator Rost',
  },
  {
    id: 'DyadCensus',
    category: 'generator',
    name: 'Dyad Census',
  },
  {
    id: 'Sociogram',
    category: 'sociogram',
    name: 'Sociogram',
  },
  {
    id: 'EgoForm',
    category: 'interpreter',
    name: 'Ego Form',
  },
  {
    id: 'AlterForm',
    category: 'interpreter',
    name: 'Per Alter Form',
  },
  {
    id: 'Information',
    category: 'utility',
    name: 'Information',
  },
];

const Interface = ({
  id,
}) => {
  if (!id) { return null; }
  const meta = find(interfaces, ['id', id]);
  console.log({ interfaces, meta, id });
  // if (meta) { throw Error(`${id} definition not found`); }

  return (
    <motion.div className="stage-type-selector__interface">
      <h1>{ meta.name }</h1>
      { meta.category }
    </motion.div>
  );
};

export default Interface;
