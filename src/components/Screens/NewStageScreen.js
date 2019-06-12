import React from 'react';
import PropTypes from 'prop-types';
import Screen from '../Screen/Screen';
import NewStage from '../NewStage';

const NewStageScreen = ({
  show,
  transitionState,
  onComplete,
  ...rest
}) => (
  <Screen
    show={show}
    transitionState={transitionState}
    onCancel={onComplete}
  >
    <NewStage {...rest} />
  </Screen>
);

NewStageScreen.propTypes = {
  show: PropTypes.bool,
  transitionState: PropTypes.string,
  onComplete: PropTypes.func.isRequired,
};

NewStageScreen.defaultProps = {
  show: false,
  transitionState: null,
};

export { NewStageScreen };

export default NewStageScreen;
