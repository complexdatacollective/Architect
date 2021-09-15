import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@codaco/ui';

const Steps = ({ children, step }) => {
  const renderStep = children.find(({ props }) => props.id === step);

  if (!renderStep) { return null; }
  return renderStep;
};

const Step = ({ children, onBack, actions }) => (
  <motion.div className="stage-type-selector__wizard-step">
    <div onClick={onBack}>&lt; back</div>
    {children}
    {actions && actions.map(({ label, onClick }) => (
      <Button onClick={onClick}>{label}</Button>
    ))}
  </motion.div>
);

const Wizard = ({
  onSelect,
  onQuit,
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
    <motion.div className="stage-type-selector__wizard">
      <div onClick={onQuit}>Quit</div>
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
          onBack={previousStep}
          actions={[
            { label: 'Yes', onClick: () => nextStep('generator') },
            { label: 'No', onClick: () => nextStep('ask-create-edges') },
          ]}
        >
          <p>Do you want to create alters?</p>
        </Step>
        <Step
          id="ask-create-edges"
          onBack={previousStep}
          actions={[
            { label: 'Yes', onClick: () => nextStep('sociogram') },
            { label: 'No', onClick: () => nextStep('ask-layout') }
          ]}
        >
          <p>Do you want to create edges?</p>
        </Step>
        <Step
          id="ask-layout"
          onBack={previousStep}
          actions={[
            { label: 'Yes', onClick: () => nextStep('sociogram') },
            { label: 'No', onClick: () => nextStep('other') }
          ]}
        >
          <p>Do you want to create a layout of existing nodes?</p>
        </Step>
        <Step
          id="generator"
          onBack={previousStep}
        >
          <h1>Generator</h1>
        </Step>
        <Step
          id="sociogram"
          onBack={previousStep}
        >
          <h1>Sociogram</h1>
        </Step>
        <Step
          id="other"
          onBack={previousStep}
        >
          <h1>Other</h1>
        </Step>
      </Steps>
    </motion.div>
  );
};

export default Wizard;
