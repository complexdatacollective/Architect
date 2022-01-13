import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { find, get } from 'lodash';
import timelineImages from '@app/images/timeline';
import Tag from '@components/Tag';
import { INTERFACE_TYPES, TAG_COLORS } from './interfaceOptions';

const getTimelineImage = (type) => get(timelineImages, type);

const InterfaceThumbnail = ({
  type: interfaceType,
  onClick,
}) => {
  const meta = useMemo(() => find(INTERFACE_TYPES, ['type', interfaceType]), [interfaceType]);
  const image = getTimelineImage(interfaceType);
  const { title, tags, description } = meta;

  if (!meta) {
    throw Error(`${interfaceType} definition not found`);
  }

  const handleSelect = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    onClick(interfaceType);
  }, [onClick, interfaceType]);

  const handleKeyUp = useCallback((e) => {
    if (e.key === 'Enter') {
      onClick(interfaceType);
    }
  });

  return (
    <motion.div
      className="new-stage-screen__interface"
      onClick={handleSelect}
      onKeyUp={handleKeyUp}
      tabIndex={0}
    >
      <h3>{ title }</h3>
      { image && <img className="new-stage-screen__interface-preview" src={image} alt={title} /> }
      <div className="new-stage-screen__interface-description">
        {description}
      </div>
      <div className="new-stage-screen__interface-tags">
        {tags.map((tag) => (
          <Tag
            key={tag}
            id={tag}
            color={get(TAG_COLORS, tag)}
            selected
          >
            {tag}
          </Tag>
        ))}
      </div>
    </motion.div>
  );
};

InterfaceThumbnail.propTypes = {
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default InterfaceThumbnail;
