import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import cx from 'classnames';
import interfaceTypes from './interfaceTypes';
import InterfaceList from './InterfaceList';

const isSelectable = (selectedCategory, category) => {
  if (!selectedCategory) { return true; }
  if (category === selectedCategory) { return true; }
  return false;
};

const MenuItem = ({
  category,
  children,
  selected,
  onClick,
}) => {
  const classes = cx(
    'stage-type-selector__menu-item',
    {
      'stage-type-selector__menu-item--selected': selected,
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

const CategorizedInterfaceList = ({
  onSelect,
  onHelp,
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
    <motion.div className="stage-type-selector__categorized">
      <motion.div className="stage-type-selector__menu">
        <motion.ul className="stage-type-selector__menu-items">
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
        <div onClick={onHelp}>Need help?</div>
      </motion.div>
      <InterfaceList items={selectableInterfaces} />
    </motion.div>
  );
};

export default CategorizedInterfaceList;
