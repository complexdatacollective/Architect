import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { get } from 'lodash';
import Tag from '@components/Tag';
import {
  INTERFACE_TYPES,
  TAGS,
  TAG_COLORS,
} from './interfaceOptions';
import InterfaceList from './InterfaceList';

const allTagsSelected = (selectedTags, tags) => {
  if (selectedTags.length === 0) { return true; }
  return selectedTags.every((tag) => tags.includes(tag));
};

const CategorizedInterfaceList = ({
  onSelect,
  menuOther,
}) => {
  const [selectedTags, setSelectedTags] = useState([]);

  const handleAddTag = useCallback((newTag) => {
    setSelectedTags((tags) => [...tags, newTag]);
  }, [setSelectedTags]);

  const handleRemoveTag = useCallback((existingTag) => {
    setSelectedTags(
      (tags) => tags.filter(
        (tag) => tag !== existingTag,
      ),
    );
  }, [setSelectedTags]);

  const selectableInterfaces = useMemo(
    () => INTERFACE_TYPES
      .filter(
        ({ tags }) => allTagsSelected(selectedTags, tags),
      ),
    [selectedTags],
  );

  const tags = useMemo(
    () => Object.values(TAGS).map((value) => ({
      value,
      selected: selectedTags.includes(value),
    })).sort((a, b) => {
      if (a.selected && b.selected) { return 0; }
      if (a.selected && !b.selected) { return -1; }
      return 1;
    }),
    [selectedTags],
  );

  return (
    <div className="new-stage-screen__categorized">
      <div className="new-stage-screen__menu">
        <div className="new-stage-screen__menu-section">
          <p><strong>Filters:</strong></p>
          <motion.div className="new-stage-screen__menu-tags" layout>
            {tags.map(({ value, selected }) => (
              <Tag
                key={value}
                id={value}
                selected={selected}
                onClick={handleAddTag}
                onReset={handleRemoveTag}
                color={get(TAG_COLORS, value)}
              >
                {value}
              </Tag>
            ))}
          </motion.div>
        </div>
        <div className="new-stage-screen__menu-other">
          {menuOther}
        </div>
      </div>
      <motion.div className="new-stage-screen__categorized-list">
        <InterfaceList items={selectableInterfaces} onSelect={onSelect} />
      </motion.div>
    </div>
  );
};

CategorizedInterfaceList.propTypes = {
  onSelect: PropTypes.func.isRequired,
  menuOther: PropTypes.node,
};

CategorizedInterfaceList.defaultProps = {
  menuOther: null,
};

export default CategorizedInterfaceList;
