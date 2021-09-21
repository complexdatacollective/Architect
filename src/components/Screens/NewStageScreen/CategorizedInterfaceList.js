import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import cx from 'classnames';
import { INTERFACE_TYPES, CATEGORIES } from './interfaceOptions';
import InterfaceList from './InterfaceList';

const isCategorySelected = (selectedCategory, category) => {
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

  const handleChangeCategory = useCallback((category) => {
    if (category === 'all') { return setSelectedCategory(undefined); }
    return setSelectedCategory(category);
  }, [setSelectedCategory]);

  const selectableInterfaces = useMemo(
    () => INTERFACE_TYPES
      .filter(({ category }) => isCategorySelected(selectedCategory, category)),
    [selectedCategory],
  );

  return (
    <motion.div className="new-stage-screen__categorized">
      <motion.div className="new-stage-screen__menu">
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
        <div className="new-stage-screen__menu-other">
          {menuOther}
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
