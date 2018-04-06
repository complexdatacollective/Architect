import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as protocolActions } from '../../ducks/modules/protocol/protocolOptions';

class TimelineOverview extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        protocol_location: 'http://northwestern.edu/my-study',
      },
    };
  }

  onOptionChange = (option, value) => {
    this.setState({
      options: {
        ...this.state.options,
        [option]: value,
      },
    });
  }

  onChangeTitle = (title) => {
    this.props.updateOptions({ title });
  }

  render() {
    return (
      <div className="timeline-overview">
        <div className="panel">
          <br />
          <br />
          <br />
        </div>
      </div>
    );
  }
}

TimelineOverview.propTypes = {
  updateOptions: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const protocol = getProtocol(state);

  return {
    title: protocol.options.title,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateOptions: bindActionCreators(protocolActions.updateOptions, dispatch),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(TimelineOverview);
