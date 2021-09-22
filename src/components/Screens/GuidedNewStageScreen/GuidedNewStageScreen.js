import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Button } from '@codaco/ui';
import { actionCreators as uiActions } from '@modules/ui';
import Screen from '@components/Screen/Screen';
import Section from '@components/EditorLayout/Section';
import Steps from './Steps';

const GuidedNewStageScreen = ({
  insertAtIndex,
  onComplete,
  show,
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

  const locus = useSelector(
    (state) => state.protocol.timeline[state.protocol.timeline.length - 1],
  );

  const dispatch = useDispatch();

  const handleSelectInterface = useCallback((interfaceType) => {
    dispatch(uiActions.closeScreen('guidedNewStage'));
    dispatch(uiActions.openScreen('stage', { type: interfaceType, locus, insertAtIndex }));
  }, [insertAtIndex, locus, dispatch]);

  const steps = useMemo(() => [
    {
      id: 'start',
      actions: [
        { label: 'Continue', step: 'ask-create-alters' },
      ],
      content: (
        <p>
          This wizard will ask you a series of questions in order to help you choose a stage type.
        </p>
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
      content: (
        <>
          <h1>Generator</h1>
          <div
            onClick={() => handleSelectInterface('Information')}
          >
            info
          </div>
        </>
      ),
    },
    {
      id: 'sociogram',
      content: (<h1>Sociogram</h1>),
    },
    {
      id: 'other',
      content: (<h1>Other</h1>),
    },
  ], [handleSelectInterface]);

  return (
    <Screen
      show={show}
      buttons={buttons}
      type="guided-new-stage"
    >
      <motion.div className="guided-new-stage-screen">
        <Section>
          <h1>Guided Stage Chooser</h1>
          <p>Find an appropriate stage type for your Protocol.</p>
        </Section>
        <Steps
          steps={steps}
          initialStep="start"
        />
      </motion.div>
    </Screen>
  );
};

GuidedNewStageScreen.propTypes = {
  insertAtIndex: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

GuidedNewStageScreen.defaultProps = {
  show: false,
};

export default GuidedNewStageScreen;
