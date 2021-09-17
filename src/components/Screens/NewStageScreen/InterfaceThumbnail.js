import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { find, get } from 'lodash';
import timelineImages from '@app/images/timeline';
import { INTERFACE_TYPES } from './interfaceOptions';

const getTimelineImage = (type) => get(timelineImages, type);

const InterfaceThumbnail = ({
  type: interfaceType,
  onClick,
}) => {
  const meta = find(INTERFACE_TYPES, ['type', interfaceType]);
  const image = getTimelineImage(interfaceType);
  const { title } = meta;

  if (!meta) {
    throw Error(`${interfaceType} definition not found`);
  }

  const handleSelect = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    onClick(interfaceType);
  }, [onClick, interfaceType]);

  return (
    <motion.div
      className="new-stage-screen__interface"
      onClick={handleSelect}
    >
      { image && <img className="new-stage-screen__interface-preview" src={image} alt={title} /> }
      <h3>{ title }</h3>
    </motion.div>
  );
};

InterfaceThumbnail.propTypes = {
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default InterfaceThumbnail;
