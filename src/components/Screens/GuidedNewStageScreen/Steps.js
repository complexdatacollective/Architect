import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@codaco/ui';

const stepVariants = {
  show: { opacity: 1, duration: 20 },
  hide: { opacity: 0, duration: 20 },
  exitLeft: { opacity: 0, translateX: '-100%', duration: 20 },
};

const Steps = ({
  steps,
  initialStep,
}) => {
  const initialState = initialStep ? [initialStep] : [steps[0].id];
  const [history, setHistory] = useState(initialState);

  const handlePreviousStep = useCallback(() => (
    setHistory((s) => {
      const nextS = s.slice(0, -1);
      if (nextS.length === 0) { return initialState; }
      return nextS;
    })
  ), [setHistory, initialStep]);

  const handleNextStep = useCallback((e) => {
    const step = e.target.closest('button') && e.target.closest('button').getAttribute('data-step');
    if (!step) { return; }
    setHistory((s) => [...s, step]);
  }, [setHistory]);

  const currentStepId = useMemo(
    () => history[history.length - 1],
    [history],
  );

  const currentStep = steps.find(({ id }) => id === currentStepId);

  if (steps.length === 0) { return null; }

  const { actions, content } = currentStep;

  console.log({ currentStepId });

  return (
    <motion.div className="guided-new-stage-screen__steps stage-editor-section" layout>
      <AnimatePresence>
        <motion.div
          className="guided-new-stage-screen__step"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, translateX: '-100%', translateY: '50px', duration: 5 }}
          layout
          key={currentStepId}
        >
          <motion.div className="guided-new-stage-screen__step-content">
            {content}
          </motion.div>
          <motion.div className="guided-new-stage-screen__step-controls">
            <motion.div className="guided-new-stage-screen__step-back">
              { history.length > 1 && (
                <Button onClick={handlePreviousStep} color="charcoal">Previous step</Button>
              )}
            </motion.div>
            <motion.div className="guided-new-stage-screen__step-actions">
              { actions && actions.map(({
                label,
                step,
                color,
                onClick,
              }) => {
                const handleClick = step ? handleNextStep : onClick;
                return (
                  <Button
                    onClick={handleClick}
                    data-step={step}
                    color={color}
                    key={label}
                  >
                    {label}
                  </Button>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const StepsPropTypes = {};

StepsPropTypes.action = PropTypes.shape({
  step: PropTypes.string,
});

StepsPropTypes.step = PropTypes.shape({
  id: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(StepsPropTypes.action),
  content: PropTypes.node.isRequired,
});

Steps.propTypes = {
  steps: PropTypes.arrayOf(StepsPropTypes.step),
  initialStep: PropTypes.string,
};

Steps.defaultProps = {
  steps: [],
  initialStep: null,
};

export default Steps;
