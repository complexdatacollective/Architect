import React from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@codaco/ui';
import Interface from './Interface';
import { PropTypes as InterfacePropTypes } from './interfaceOptions';

const InterfaceList = ({
  items,
  onSelect,
  highlightedIndex,
  handleClearSearchAndFilter,
  setHighlighted,
  removeHighlighted,
}) => (
  <motion.div className="new-stage-screen__interfaces">
    {items.length === 0 && (
      <div className="new-stage-screen__interfaces--empty">
        <p>
          No interfaces match your filter and/or search
          results. Try a different combination of types, or clear your filters and search query
          to see all available interfaces.
        </p>
        <Button onClick={handleClearSearchAndFilter}>Clear search and filter</Button>
      </div>
    )}
    <AnimatePresence initial={false}>
      {items.map(({ type: interfaceType }, index) => (
        <Interface
          key={interfaceType}
          type={interfaceType}
          onClick={onSelect}
          highlighted={index === highlightedIndex}
          setHighlighted={() => setHighlighted(index)}
          removeHighlighted={() => removeHighlighted(index)}
        />
      ))}
    </AnimatePresence>
  </motion.div>
);

InterfaceList.propTypes = {
  items: PropTypes.arrayOf(InterfacePropTypes.interface),
  onSelect: PropTypes.func.isRequired,
  highlightedIndex: PropTypes.number,
  handleClearSearchAndFilter: PropTypes.func.isRequired,
  setHighlighted: PropTypes.func.isRequired,
  removeHighlighted: PropTypes.func.isRequired,
};

InterfaceList.defaultProps = {
  items: [],
  highlightedIndex: null,
};

export default InterfaceList;
