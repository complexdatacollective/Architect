import { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as protocolFileActions } from '../../ducks/modules/protocol/file';

class Protocol extends Component {

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
    if (protocol !== this.state.protocol) {
      this.setState(
        { protocol },
        () => this.props.loadProtocol(protocol),
      );
    }
  }

  render() {
    return null;
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadProtocol: bindActionCreators(protocolFileActions.loadProtocol, dispatch),
  };
}

export { Protocol };

export default connect(
  null,
  mapDispatchToProps,
)(Protocol);
