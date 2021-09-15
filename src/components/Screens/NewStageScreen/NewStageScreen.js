import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import Button from '@codaco/ui/lib/components/Button';
import Screen from '@components/Screen/Screen';
import interfaceTypes from './interfaceTypes';
import CategorizedInterfaceList from './CategorizedInterfaceList';
import InterfaceList from './InterfaceList';
import Wizard from './Wizard';

const animations = {
  show: { opacity: 1 },
  hide: { opacity: 0 },
};

const MODES = {
  standard: 'STANDARD',
  wizard: 'WIZARD',
};

const NewStageScreen = ({
  show,
  onComplete,
}) => {
  const [mode, setMode] = useState(MODES.standard);
  const [query, setQuery] = useState('');

  const buttons = useMemo(() => [
    <Button
      key="done"
      onClick={onComplete}
      iconPosition="right"
      color="platinum"
    >
      Cancel
    </Button>,
  ], [onComplete]);

  const filteredInterfaces = useMemo(
    () => interfaceTypes.filter(
      ({ name }) => name.toLowerCase().includes(query.toLowerCase()),
    ),
    [query],
  );

  const handleUpdateQuery = useCallback((e) => {
    const { target } = e;
    const newQuery = target.value;
    setQuery(newQuery);
  }, [setQuery]);

  return (
    <Screen
      show={show}
      buttons={buttons}
      type="new-stage"
    >
      <motion.div className="stage-type-selector">
        { mode === MODES.wizard && <Wizard onQuit={() => setMode(MODES.standard)} /> }
        { mode !== MODES.wizard && (
          <>
            <motion.div className="stage-type-selector__search">
              <input
                type="text"
                value={query}
                onChange={handleUpdateQuery}
              />
            </motion.div>
            <motion.div className="stage-type-selector__container">
              <CategorizedInterfaceList
                onHelp={() => setMode(MODES.wizard)}
              />
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
                    <InterfaceList items={filteredInterfaces} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </motion.div>
    </Screen>
  );
};

NewStageScreen.propTypes = {
  show: PropTypes.bool,
  onComplete: PropTypes.func.isRequired,
};

NewStageScreen.defaultProps = {
  show: false,
};

export default NewStageScreen;
