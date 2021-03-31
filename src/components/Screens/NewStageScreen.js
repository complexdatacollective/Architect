import React from 'react';
import PropTypes from 'prop-types';
import Button from '@codaco/ui/lib/components/Button';
import Screen from '../Screen/Screen';
import NewStage from '../NewStage';

const NewStageScreen = ({
  show,
  transitionState,
  onComplete,
  ...rest
}) => {
  const buttons = [
    <Button
      key="done"
      onClick={onComplete}
      iconPosition="right"
      color="platinum"
    >
      Cancel
    </Button>,
  ];

  return (
    <Screen
      show={show}
      transitionState={transitionState}
      buttons={buttons}
    >
      <NewStage
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      />
    </Screen>
  );
};

NewStageScreen.propTypes = {
  show: PropTypes.bool,
  transitionState: PropTypes.string,
  onComplete: PropTypes.func.isRequired,
};

NewStageScreen.defaultProps = {
  show: false,
  transitionState: null,
};

export default NewStageScreen;
