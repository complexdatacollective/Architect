import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import cx from 'classnames';
import Interface, { interfaces } from './Interface';

const animations = {
  show: { opacity: 1 },
  hide: { opacity: 0 },
};

const isSelectable = (selectedCategory, category) => {
  if (!selectedCategory) { return true; }
  if (category === selectedCategory) { return true; }
  return false;
};

const MenuItem = ({ category, children, selected, onClick }) => {
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

const StageTypeSelector = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState();

  const handleSelectCategory = useCallback((e) => {
    const { target } = e;
    const category = target.getAttribute('data-category');
    if (category === 'all') { return setSelectedCategory(); }
    setSelectedCategory(category);
  }, [setSelectedCategory]);

  const handleUpdateQuery = useCallback((e) => {
    const { target } = e;
    const newQuery = target.value;
    setQuery(newQuery);
  }, [setQuery]);

  const selectableInterfaces = useMemo(
    () => interfaces.filter(
      ({ category }) => isSelectable(selectedCategory, category),
    ),
    [selectedCategory],
  );

  const resultInterfaces = useMemo(
    () => interfaces.filter(
      ({ name }) => name.toLowerCase().includes(query.toLowerCase()),
    ),
    [query],
  );

  return (
    <motion.div className="stage-type-selector">
      <motion.div className="stage-type-selector__search">
        <input
          type="text"
          value={query}
          onChange={handleUpdateQuery}
        />
      </motion.div>
      <motion.div className="stage-type-selector__container">
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
            <p>Need help?</p>
          </motion.div>
          <motion.div className="stage-type-selector__interfaces">
            <AnimatePresence>
              {selectableInterfaces.map(({ id }) => (
                <motion.div
                  className="stage-type-selector__interface-container"
                  variants={animations}
                  initial="hide"
                  exit="hide"
                  animate="show"
                  key={id}
                >
                  <Interface id={id} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
        <AnimatePresence>
          { query !== '' && (
            <motion.div
              className="stage-type-selector__results"
              variants={animations}
              initial="hide"
              exit="hide"
              animate="show"
              key="results"
            >
              <motion.div className="stage-type-selector__interfaces">
                <AnimatePresence>
                  {resultInterfaces.map(({ id }) => (
                    <motion.div
                      className="stage-type-selector__interface-container"
                      variants={animations}
                      initial="hide"
                      exit="hide"
                      animate="show"
                      key={id}
                    >
                      <Interface id={id} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default StageTypeSelector;
