/* eslint-disable */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Stage extends PureComponent {
  static propTypes = {
    stages: PropTypes.array.isRequired,
  };

  render() {
    return (
      <div className="stage">
        Stage
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    stages: state.stages,
  };
}

function mapDispatchToProps() {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Stage);
