import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const StageTypeSelector = ({

}) => {
  const [query, setQuery] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  return (
    <motion.div className="stage-type-selector">
      <motion.div className="stage-type-selector__search">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      </motion.div>
      <motion.div className="stage-type-selector__categorized">
        <motion.div className="stage-type-selector__menu">
          <motion.ul className="stage-type-selector__menu-items">
            <li onClick={() => setSelectedCategory('generator')}>Generators</li>
            <li onClick={() => setSelectedCategory('sociogram')}>Sociograms</li>
            <li onClick={() => setSelectedCategory('interpreter')}>Interpreters</li>
            <li onClick={() => setSelectedCategory('utility')}>Utilities</li>
          </motion.ul>
          <p>Need help?</p>
        </motion.div>
        <motion.div className="stage-type-selector__interfaces">
          <AnimatePresence>
            {interfaces.map(({ id, category }) => (
              isSelectable(selectedCategory, category) && (
                <motion.div
                  className="stage-type-selector__interface-container"
                >
                  <Interface id={id} />
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <motion.div className="stage-type-selector__results">
        <motion.div className="stage-type-selector__interfaces">
          {[1, 2, 3, 4, 5, 6].map(() => (
            <motion.div className="stage-type-selector__interface-container">
              <Interface />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default StageTypeSelector;
