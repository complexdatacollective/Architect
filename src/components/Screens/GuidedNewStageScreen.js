import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@codaco/ui';
import Screen from '@components/Screen/Screen';

const Steps = ({ children, step }) => {
  const renderStep = children.find(({ props }) => props.id === step);

  if (!renderStep) { return null; }

  return (
    <motion.div className="guided-new-stage-screen__steps">
      {renderStep}
    </motion.div>
  );
};

const Step = ({ children, onBack, actions }) => (
  <motion.div className="guided-new-stage-screen__step">
    <motion.div className="guided-new-stage-screen__step-content">
      {children}
    </motion.div>
    <motion.div className="guided-new-stage-screen__step-actions">
      {actions && actions.map(({ label, onClick, color }) => (
        <Button onClick={onClick} color={color}>{label}</Button>
      ))}
    </motion.div>
  </motion.div>
);

const GuidedNewStageScreen = ({
  show,
  onSelect,
  onComplete,
}) => {
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

  const [steps, setSteps] = useState(['start']);
  const previousStep = () => setSteps((s) => {
    const nextS = s.slice(0, -1);
    if (nextS.length === 0) { return ['start']; }
    return nextS;
  });
  const nextStep = (step) => setSteps((s) => [...s, step]);
  const step = useMemo(() => steps[steps.length - 1], [steps]);

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
        { steps.length > 1 && (
          <div className="guided-new-stage-screen__section">
            <Button size="small" onClick={previousStep} color="charcoal">Previous step</Button>
          </div>
        )}
        <Steps step={step}>
          <Step
            id="start"
            actions={[
              { label: 'Continue', onClick: () => nextStep('ask-create-alters') },
            ]}
          >
            <p>This wizard will ask you a series of questions.</p>
          </Step>
          <Step
            id="ask-create-alters"
            actions={[
              { label: 'Yes', onClick: () => nextStep('generator') },
              { label: 'No', onClick: () => nextStep('ask-create-edges'), color: 'white' },
            ]}
          >
            <p>Do you want to create alters?</p>
          </Step>
          <Step
            id="ask-create-edges"
            actions={[
              { label: 'Yes', onClick: () => nextStep('sociogram') },
              { label: 'No', onClick: () => nextStep('ask-layout'), color: 'white' },
            ]}
          >
            <p>Do you want to create edges?</p>
          </Step>
          <Step
            id="ask-layout"
            actions={[
              { label: 'Yes', onClick: () => nextStep('sociogram') },
              { label: 'No', onClick: () => nextStep('other'), color: 'white' },
            ]}
          >
            <p>Do you want to create a layout of existing nodes?</p>
          </Step>
          <Step
            id="generator"
          >
            <h1>Generator</h1>
          </Step>
          <Step
            id="sociogram"
          >
            <h1>Sociogram</h1>
          </Step>
          <Step
            id="other"
          >
            <h1>Other</h1>
          </Step>
        </Steps>
      </motion.div>
    </Screen>
  );
};

export default GuidedNewStageScreen;
