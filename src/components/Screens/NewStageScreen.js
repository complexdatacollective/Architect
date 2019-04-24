import React from 'react';
import PropTypes from 'prop-types';
import Card from './ProtocolCard';
import NewStage from '../NewStage';

const NewStageScreen = ({
  show,
  transitionState,
  onComplete,
  ...rest
}) => (
  <Card
    show={show}
    transitionState={transitionState}
    onCancel={onComplete}
  >
    <NewStage {...rest} />
  </Card>
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
