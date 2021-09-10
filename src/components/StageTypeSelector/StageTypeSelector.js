import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Interface from './Interface';

const StageTypeSelector = ({

}) => {
  const [query, setQuery] = useState();

  return (
    <motion.div className="stage-type-selector">
      <motion.div className="stage-type-selector__search">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      </motion.div>
      <motion.div>
        <motion.div className="stage-type-selector__categorized">
          <motion.div className="stage-type-selector__menu">
            <motion.ul className="stage-type-selector__menu-items">
              <li>Name generators</li>
            </motion.ul>
            <p>Need help?</p>
          </motion.div>
          <motion.div className="stage-type-selector__interfaces">
            <Interface />
          </motion.div>
        </motion.div>
        <motion.div className="stage-type-selector__results">
          <motion.div className="stage-type-selector__interfaces">
            <Interface />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default StageTypeSelector;
