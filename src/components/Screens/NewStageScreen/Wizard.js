import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@codaco/ui';

const Steps = ({ children, step }) => {
  const renderStep = children.find(({ props }) => props.id === step);

  if (!renderStep) { return null; }
  return renderStep;
};

const Step = ({ children, onBack, actions }) => (
  <motion.div className="new-stage-screen__wizard-step">
    {children}
    {actions && actions.map(({ label, onClick, color }) => (
      <Button onClick={onClick} color={color}>{label}</Button>
    ))}
  </motion.div>
);

const Wizard = ({
  onSelect,
  onQuit: onExit,
}) => {
  const [steps, setSteps] = useState(['start']);
  const previousStep = () => setSteps((s) => {
    const nextS = s.slice(0, -1);
    if (nextS.length === 0) { return ['start']; }
    return nextS;
  });
  const nextStep = (step) => setSteps((s) => [...s, step]);
  const step = useMemo(() => steps[steps.length - 1], [steps]);

  return (
    <motion.div className="new-stage-screen__wizard">
      <div className>
        <h1>Guided Stage Chooser</h1>
        <Button size="small" onClick={onExit} color="white">Exit guide</Button>
      </div>
      { steps.length > 1 && (
        <div className>
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
  );
};

export default Wizard;
