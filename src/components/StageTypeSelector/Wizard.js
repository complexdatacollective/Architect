import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@codaco/ui';

const Steps = ({ children, step }) => children[step];

const Step = ({ children, onBack, onContinue }) => (
  <motion.div className="stage-type-selector__wizard-step">
    <div onClick={onBack}>&lt; back</div>
    {children}
    <Button onClick={onContinue}>Continue</Button>
  </motion.div>
);

const Wizard = ({
  onSelect,
  onQuit,
}) => {
  const [step, setStep] = useState(0);
  const handleContinue = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  return (
    <motion.div className="stage-type-selector__wizard">
      <div onClick={onQuit}>Quit</div>
      <Steps step={step}>
        <Step onContinue={handleContinue}>
          step 1
        </Step>
        <Step onBack={handleBack} onContinue={handleContinue}>
          step 2
        </Step>
        <Step onBack={handleBack}>
          step 2
        </Step>
      </Steps>
    </motion.div>
  );
};

export default Wizard;
