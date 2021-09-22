import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@codaco/ui';
import { getCSSVariableAsNumber } from '@codaco/ui/lib/utils/CSSVariables';

const Steps = ({
  steps,
  initialStep,
}) => {
  const initialState = initialStep ? [initialStep] : [steps[0].id];
  const [history, setHistory] = useState(initialState);

  const stepVariants = useMemo(() => {
    const standardDuration = getCSSVariableAsNumber('--animation-duration-standard-ms') / 1000;

    return {
      initial: { opacity: 0, x: 0 },
      animate: {
        opacity: 1,
        x: 0,
        transition: {
          delay: standardDuration,
          duration: standardDuration,
        },
      },
      exit: {
        opacity: 0,
        x: 'calc(-50%)',
        position: 'absolute',
        y: 0,
        width: '100%',
        transition: { duration: standardDuration },
      },
    };
  }, []);

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

  return (
    <motion.div className="guided-new-stage-screen__steps stage-editor-section" layout>
      <AnimatePresence>
        <motion.div
          className="guided-new-stage-screen__step"
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          key={currentStepId}
        >
          <div className="guided-new-stage-screen__step-content">
            {content}
          </div>
          <div className="guided-new-stage-screen__step-controls">
            <div className="guided-new-stage-screen__step-back">
              { history.length > 1 && (
                <Button onClick={handlePreviousStep} color="charcoal">Previous step</Button>
              )}
            </div>
            <div className="guided-new-stage-screen__step-actions">
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
            </div>
          </div>
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
