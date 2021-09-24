import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import cx from 'classnames';
import Tag from '@components/Tag';
import { INTERFACE_TYPES, CATEGORIES, TAGS } from './interfaceOptions';
import InterfaceList from './InterfaceList';

const isCategorySelected = (selectedCategory, category) => {
  if (!selectedCategory) { return true; }
  return category === selectedCategory;
};

const anyTagsSelected = (selectedTags, tags) => {
  if (selectedTags.length === 0) { return true; }
  return tags.some((tag) => selectedTags.includes(tag));
};

const MenuItem = ({
  category,
  children,
  onClick,
  selected,
}) => {
  const classes = cx(
    'new-stage-screen__menu-item',
    {
      'new-stage-screen__menu-item--selected': selected,
    },
  );

  const handleClick = useCallback(() => {
    onClick(category);
  }, [onClick, category]);

  return (
    <li className={classes}>
      <div onClick={handleClick}>
        {children}
      </div>
    </li>
  );
};

MenuItem.propTypes = {
  category: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

MenuItem.defaultProps = {
  selected: false,
};

const CategorizedInterfaceList = ({
  onSelect,
  menuOther,
}) => {
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedTags, setSelectedTags] = useState([]);

  const handleChangeCategory = useCallback((category) => {
    if (category === 'all') { return setSelectedCategory(undefined); }
    return setSelectedCategory(category);
  }, [setSelectedCategory]);

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
        ({ category, tags }) => (
          isCategorySelected(selectedCategory, category)
          && anyTagsSelected(selectedTags, tags)
        ),
      ),
    [selectedCategory, selectedTags],
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
          <motion.ul className="new-stage-screen__menu-items">
            <MenuItem
              onClick={handleChangeCategory}
              category="all"
              selected={selectedCategory === undefined}
            >
              All
            </MenuItem>
            { Object.values(CATEGORIES).map((category) => (
              <MenuItem
                key={category}
                onClick={handleChangeCategory}
                category={category}
                selected={selectedCategory === category}
              >
                {category}
              </MenuItem>
            )) }
          </motion.ul>
        </div>
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
