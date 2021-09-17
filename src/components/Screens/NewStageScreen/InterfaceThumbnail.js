import React from 'react';
import { motion } from 'framer-motion';
import { find, get } from 'lodash';
import timelineImages from '@app/images/timeline';
import interfaceTypes from './interfaceTypes';

const getTimelineImage = (type) => get(timelineImages, type);

const Interface = ({
  id,
}) => {
  if (!id) { return null; }

  const meta = find(interfaceTypes, ['id', id]);
  const image = getTimelineImage(id);
  const title = meta.name;

  if (!meta) {
    throw Error(`${id} definition not found`);
  }

  return (
    <motion.div className="new-stage-screen__interface">
      { image && <img className="new-stage-screen__interface-preview" src={image} alt={title} /> }
      <h3>{ title }</h3>
    </motion.div>
  );
};

export default Interface;
