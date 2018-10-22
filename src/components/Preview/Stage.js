import { connect } from 'react-redux';
import { compose } from 'recompose';
import Stage from '../../network-canvas/src/containers/Stage';

const mapStateToProps = (state, props) => {
  return {
    stage: state.protocol.stages[props.stageIndex],
    promptId: state.sessions[state.session].promptIndex,
  };
};

export default compose(
  connect(mapStateToProps),
)(
  Stage,
);
