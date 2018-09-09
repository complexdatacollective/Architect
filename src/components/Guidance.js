import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as guidedActionCreators } from '../ducks/modules/guidance';

class Guided extends Component {
  static propTypes = {
    contentId: PropTypes.string.isRequired,
    setGuidance: PropTypes.func.isRequired,
    unsetGuidance: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    focus: PropTypes.bool,
  };

  static defaultProps = {
    focus: false,
  };

  interactionHandlers() {
    if (this.props.focus) {
      return {
        onFocus: this.handleSet,
        onBlur: this.handleUnset,
      };
    }

    return {
      onMouseEnter: this.handleSet,
      onMouseLeave: this.handleUnset,
    };
  }

  handleSet = () => {
    this.props.setGuidance(this.props.contentId, this.props.focus ? 'focus' : 'mouse');
  }

  handleUnset = () => {
    this.props.unsetGuidance(this.props.focus ? 'focus' : 'mouse');
  }

  render() {
    return React.cloneElement(
      this.props.children,
      this.interactionHandlers(),
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setGuidance: bindActionCreators(guidedActionCreators.setGuidance, dispatch),
  unsetGuidance: bindActionCreators(guidedActionCreators.unsetGuidance, dispatch),
});

export { Guided };

export default connect(
  null, mapDispatchToProps,
)(Guided);
