import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as guidedActionCreators } from '../ducks/modules/guidance';

const MOUSE = 'MOUSE';
const FOCUS = 'FOCUS';

class Guided extends Component {
  static propTypes = {
    contentId: PropTypes.string.isRequired,
    setGuidance: PropTypes.func.isRequired,
    clearGuidance: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    interaction: PropTypes.oneOf([
      MOUSE,
      FOCUS,
    ]),
  };

  static defaultProps = {
    interaction: MOUSE,
  };

  get interactionHandlers() {
    switch (this.props.interaction) {
      case MOUSE:
        return {
          onMouseEnter: this.handleMouseEnter,
          onMouseLeave: this.handleMouseLeave,
        };
      case FOCUS:
        return {
          onFocus: this.handleFocus,
          onBlur: this.handleBlur,
        };
      default:
        return {};
    }
  }

  handleMouseEnter = () => {
    this.props.setGuidance(this.props.contentId);
  }

  handleMouseLeave = () => {
    this.props.clearGuidance();
  }

  handleFocus = () => {
    this.props.setGuidance(this.props.contentId);
  }

  handleBlur = () => {
    this.props.clearGuidance();
  }

  render() {
    return React.cloneElement(
      this.props.children,
      this.interactionHandlers,
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
