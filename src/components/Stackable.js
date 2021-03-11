import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  compose,
  withState,
} from 'recompose';
import uuid from 'uuid';
import { actionCreators as stackActions } from '../ducks/modules/stacks';

const withStackableId = withState('stackableId', 'setStackableId', null);

class Stackable extends Component {
  constructor(props) {
    super(props);
    const { group, registerStackable, setStackableId } = this.props;
    const id = uuid();
    registerStackable(id, group);
    setStackableId(id);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.stackKey !== this.props.stackKey) {
      this.props.moveToTop();
    }
  }

  componentWillUnmount() {
    const id = this.props.stackableId;
    this.props.unregisterStackable(id);
  }

  render() {
    const {
      stackIndex,
      children,
    } = this.props;

    return (
      <>
        {children({ stackIndex })}
      </>
    );
  }
}

Stackable.propTypes = {
  group: PropTypes.string,
  stackKey: PropTypes.any,
  stackIndex: PropTypes.number.isRequired,
  children: PropTypes.func.isRequired,
  stackableId: PropTypes.string,
  setStackableId: PropTypes.func.isRequired,
  registerStackable: PropTypes.func.isRequired,
  unregisterStackable: PropTypes.func.isRequired,
  moveToTop: PropTypes.func.isRequired,
};

Stackable.defaultProps = {
  group: null,
  stackKey: null,
  stackableId: null,
};

const mapStateToProps = (state, { stackableId }) => {
  const stackIndex = state.stacks[stackableId]
    ? state.stacks[stackableId].index
    : 0;

  return ({
    stackIndex,
  });
};

const mapDispatchToProps = (dispatch) => ({
  moveToTop: bindActionCreators(stackActions.moveToTop, dispatch),
  registerStackable: bindActionCreators(stackActions.registerStackable, dispatch),
  unregisterStackable: bindActionCreators(stackActions.unregisterStackable, dispatch),
});

export { Stackable };

export default compose(
  withStackableId,
  connect(mapStateToProps, mapDispatchToProps),
)(Stackable);
