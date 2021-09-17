import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import cx from 'classnames';
import interfaceTypes from './interfaceTypes';
import InterfaceList from './InterfaceList';
import ScreenLink from '../ScreenLink';

const isSelectable = (selectedCategory, category) => {
  if (!selectedCategory) { return true; }
  if (category === selectedCategory) { return true; }
  return false;
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

  return (
    <li className={classes}>
      <div onClick={onClick} data-category={category}>
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
}) => {
  const [selectedCategory, setSelectedCategory] = useState();

  const handleSelectCategory = useCallback((e) => {
    const { target } = e;
    const category = target.getAttribute('data-category');
    if (category === 'all') { return setSelectedCategory(); }
    return setSelectedCategory(category);
  }, [setSelectedCategory]);

  const selectableInterfaces = useMemo(
    () => interfaceTypes.filter(
      ({ category }) => isSelectable(selectedCategory, category),
    ),
    [selectedCategory],
  );

  return (
    <motion.div className="new-stage-screen__categorized">
      <motion.div className="new-stage-screen__menu">
        <motion.ul className="new-stage-screen__menu-items">
          <MenuItem
            onClick={handleSelectCategory}
            category="all"
          >
            All
          </MenuItem>
          <MenuItem
            onClick={handleSelectCategory}
            category="name-generator"
            selected={selectedCategory === 'name-generator'}
          >
            Name Generators
          </MenuItem>
          <MenuItem
            onClick={handleSelectCategory}
            category="sociogram"
            selected={selectedCategory === 'sociogram'}
          >
            Sociograms
          </MenuItem>
          <MenuItem
            onClick={handleSelectCategory}
            category="interpreter"
            selected={selectedCategory === 'interpreter'}
          >
            Interpreters
          </MenuItem>
          <MenuItem
            onClick={handleSelectCategory}
            category="utility"
            selected={selectedCategory === 'utility'}
          >
            Utilities
          </MenuItem>
        </motion.ul>
        <div className="new-stage-screen__menu-other">
          <ScreenLink screen="guidedNewStage">Need help?</ScreenLink>
        </div>
      </motion.div>
      <motion.div className="new-stage-screen__categorized-list">
        <InterfaceList items={selectableInterfaces} onSelect={onSelect} />
      </motion.div>
    </motion.div>
  );
};

CategorizedInterfaceList.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default CategorizedInterfaceList;
