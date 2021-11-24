import React from 'react';
import PropTypes from 'prop-types';
import Button from '@codaco/ui/lib/components/Button';
import Screen from '@components/Screen/Screen';
import NewStage from '@components/NewStage';

const NewStageScreen = ({
  layoutId,
  onComplete,
  show,
  transitionState,
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
      layoutId={layoutId}
    >
      <NewStage
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      />
    </Screen>
  );
};

NewStageScreen.propTypes = {
  layoutId: PropTypes.string,
  onComplete: PropTypes.func.isRequired,
  show: PropTypes.bool,
  transitionState: PropTypes.string,
};

NewStageScreen.defaultProps = {
  layoutId: null,
  show: false,
  transitionState: null,
};

export default NewStageScreen;
