import { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actionCreators as loadProtocolActions } from '../ducks/modules/protocols/load';

class ProtocolLoader extends Component {
  constructor(props) {
    super(props);

    // TODO: Should this go into redux?
    this.state = {
      protocol: '',
    };
  }

  componentDidMount() {
    this.loadProtocol(decodeURIComponent(this.props.match.params.protocol));
  }

  componentWillReceiveProps(newProps) {
    this.loadProtocol(decodeURIComponent(newProps.match.params.protocol));
  }

  loadProtocol(protocol) {
    // If we've already loaded this route, don't load it again because we'll lose any changes
    console.log({ protocol });
    if (protocol === this.state.protocol) { return; }

    this.setState(
      { protocol },
      () => this.props.loadProtocol(protocol),
    );
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = dispatch => ({
  loadProtocol: bindActionCreators(loadProtocolActions.loadProtocol, dispatch),
});

ProtocolLoader.propTypes = {
  loadProtocol: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export { ProtocolLoader };

export default connect(
  null,
  mapDispatchToProps,
)(ProtocolLoader);
