import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  compose,
  lifecycle,
} from 'recompose';
import uuid from 'uuid';
import { actionCreators as stackActions } from '../ducks/modules/stacks';

const stackableHandlers = connect(
  null,
  (dispatch) => ({
    registerStackable: bindActionCreators(stackActions.registerStackable, dispatch),
    unregisterStackable: bindActionCreators(stackActions.unregisterStackable, dispatch),
  }),
);

const stackableLifecycle = lifecycle({
  componentWillMount() {
    const { group } = this.props;
    const id = uuid();
    this.props.registerStackable(id, group);
    this.setState({ stackableId: id });
  },
  componentWillUnmount() {
    const id = this.state.stackableId;
    this.props.unregisterStackable(id);
  },
});

const withRegisterStackable = compose(
  stackableHandlers,
  stackableLifecycle,
);

const withStackIndex = connect(
  (state, { stackableId }) => ({
    stackIndex: state.stacks[stackableId].index,
  }),
);

const stackable = compose(
  withRegisterStackable,
  withStackIndex,
);

export default stackable;
