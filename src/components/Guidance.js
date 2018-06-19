import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as guidedActionCreators } from '../ducks/modules/guidance';

class Guided extends Component {
  static propTypes = {
    guidance: PropTypes.string.isRequired,
    setGuidance: PropTypes.func.isRequired,
    clearGuidance: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  handleMouseEnter = () => {
    this.props.setGuidance(this.props.guidance);
  }

  handleMouseLeave = () => {
    this.props.clearGuidance();
  }

  render() {
    return React.cloneElement(
      this.props.children,
      {
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
      },
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setGuidance: bindActionCreators(guidedActionCreators.setGuidance, dispatch),
  clearGuidance: bindActionCreators(guidedActionCreators.resetGuidance, dispatch),
});

export { Guided };

export default connect(
  null, mapDispatchToProps,
)(Guided);
