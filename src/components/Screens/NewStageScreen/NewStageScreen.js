import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Text from '@codaco/ui/lib/components/Fields/Text';
import Button from '@codaco/ui/lib/components/Button';
import Screen from '@components/Screen/Screen';
import interfaceTypes from './interfaceTypes';
import CategorizedInterfaceList from './CategorizedInterfaceList';
import InterfaceList from './InterfaceList';

const animations = {
  show: { opacity: 1 },
  hide: { opacity: 0 },
};

const NewStageScreen = ({
  show,
  onComplete,
}) => {
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

  const hasQuery = query !== '';

  const componentClasses = cx(
    'new-stage-screen',
    {
      'new-stage-screen--has-query': hasQuery,
    },
  );

  return (
    <Screen
      show={show}
      buttons={buttons}
      type="new-stage"
    >
      <motion.div className={componentClasses}>
        <motion.div className="new-stage-screen__search">
          <Text
            input={{
              value: query,
              onChange: handleUpdateQuery,
            }}
          />
        </motion.div>
        <motion.div className="new-stage-screen__container">
          <CategorizedInterfaceList />
          <AnimatePresence>
            { hasQuery && (
              <motion.div
                className="new-stage-screen__results"
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
