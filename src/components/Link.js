import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actionCreators as uiActions } from '../ducks/modules/ui';

class Link extends Component {
  handleClick = () => {
    const { screen, params, openScreen } = this.props;
    openScreen(screen, params);
  }

  render() {
    const {
      screen, params, openScreen, children, ...rest
    } = this.props;
    return (
      <a {...rest} onClick={this.handleClick}>
        {children}
      </a>
    );
  }
}

Link.propTypes = {
  children: PropTypes.node.isRequired,
  screen: PropTypes.string.isRequired,
  params: PropTypes.object,
  openScreen: PropTypes.func.isRequired,
};

Link.defaultProps = {
  params: {},
};

const mapDispatchToProps = {
  openScreen: uiActions.openScreen,
};

export { Link };

export default connect(null, mapDispatchToProps)(Link);
