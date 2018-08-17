import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Flipped } from 'react-flip-toolkit';
import PropTypes from 'prop-types';
import ProtocolStack from './ProtocolStack';

class RecentProtocols extends Component {
  static propTypes = {
    recentProtocols: PropTypes.array,
  };

  static defaultProps = {
    recentProtocols: [
      { filePath: 'rstst' },
      { filePath: 'bar' },
    ],
  };

  renderRecentProtocol = (protocol) => {
    return (
      <div
        key={protocol.filePath}
        className="recent-protocols__protocol"
      >
        <Flipped flipId={protocol.filePath}>
          <ProtocolStack
            protocol={protocol}
          />
        </Flipped>
      </div>
    );
  }

  render() {
    const { show, recentProtocols } = this.props;

    if (!show) { return null; }

    return (
      <div className="recent-protocols">
        { recentProtocols.map(this.renderRecentProtocol) }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  recentProtocols: [{ filePath: '/dev/null/fake' }],
  // recentProtocols: get(state, 'recentProtocols', []).slice(0, 3),
});

export { RecentProtocols };

export default compose(
  connect(mapStateToProps),
)(RecentProtocols);

