import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@codaco/ui';
import Screen from '@components/Screen/Screen';

const Steps = ({
  steps,
  initialStep,
}) => {
  const [history, setHistory] = useState([initialStep]);

  const previousStep = () => setHistory((s) => {
    const nextS = s.slice(0, -1);
    if (nextS.length === 0) { return [initialStep]; }
    return nextS;
  });

  const goToStep = (e) => {
    const step = e.target && e.target.getAttribute('data-step');
    if (!step) { return; }
    setHistory((s) => [...s, step]);
  };

  const currentStepId = useMemo(
    () => history[history.length - 1],
    [history],
  );

  const currentStep = steps.find(({ id }) => id === currentStepId);

  if (!currentStep) { return null; }

  const { actions, content } = currentStep;

  return (
    <motion.div className="guided-new-stage-screen__steps">
      <motion.div className="guided-new-stage-screen__step">
        <motion.div className="guided-new-stage-screen__step-content">
          {content}
        </motion.div>
        <motion.div className="guided-new-stage-screen__step-controls">
          <motion.div className="guided-new-stage-screen__step-back">
            { history.length > 1 && (
              <Button onClick={previousStep} color="charcoal">Previous step</Button>
            )}
          </motion.div>
          <motion.div className="guided-new-stage-screen__step-actions">
            { actions && actions.map(({
              label,
              step,
              color,
              onClick,
            }) => {
              const handleClick = step ? goToStep : onClick;
              return (
                <Button
                  onClick={handleClick}
                  data-step={step}
                  color={color}
                >
                  {label}
                </Button>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const steps = [
  {
    id: 'start',
    actions: [
      { label: 'Continue', step: 'ask-create-alters' },
    ],
    content: (
      <p>This wizard will ask you a series of questions.</p>
    ),
  },
  {
    id: 'ask-create-alters',
    actions: [
      { label: 'No', step: 'ask-create-edges', color: 'white' },
      { label: 'Yes', step: 'generator' },
    ],
    content: (
      <p>Do you want to create alters?</p>
    ),
  },
  {
    id: 'ask-create-edges',
    actions: [
      { label: 'No', step: 'ask-layout', color: 'white' },
      { label: 'Yes', step: 'sociogram' },
    ],
    content: (
      <p>Do you want to create edges?</p>
    ),
  },
  {
    id: 'ask-layout',
    actions: [
      { label: 'No', step: 'other', color: 'white' },
      { label: 'Yes', step: 'sociogram' },
    ],
    content: (
      <p>Do you want to create a layout of existing nodes?</p>
    ),
  },
  {
    id: 'generator',
    content: (<h1>Generator</h1>),
  },
  {
    id: 'sociogram',
    content: (<h1>Sociogram</h1>),
  },
  {
    id: 'other',
    content: (<h1>Other</h1>),
  }
];

const GuidedNewStageScreen = ({
  show,
  onSelect,
  onComplete,
}) => {
  const buttons = useMemo(() => [
    <Button
      key="cancel"
      onClick={onComplete}
      color="platinum"
    >
      Cancel
    </Button>,
  ], [onComplete]);

  return (
    <Screen
      show={show}
      buttons={buttons}
      type="guided-new-stage"
    >
      <motion.div className="guided-new-stage-screen">
        <div className="guided-new-stage-screen__section">
          <h1>Guided Stage Chooser</h1>
        </div>
        <Steps
          steps={steps}
          initialStep="start"
        />
      </motion.div>
    </Screen>
  );
};

export default GuidedNewStageScreen;
