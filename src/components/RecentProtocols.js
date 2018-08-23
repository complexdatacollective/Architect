import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Flipped } from 'react-flip-toolkit';
import PropTypes from 'prop-types';
import ProtocolStack from './ProtocolStack';

class RecentProtocols extends Component {
  static propTypes = {
    recentProtocols: PropTypes.array.isRequired,
    show: PropTypes.bool,
  };

  static defaultProps = {
    show: true,
  };

  renderRecentProtocol = protocol => (
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

  render() {
    const { show, recentProtocols } = this.props;

    if (!show || recentProtocols.length === 0) { return null; }

    return (
      <div className="recent-protocols">
        { recentProtocols.map(this.renderRecentProtocol) }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  recentProtocols: get(state, 'recentProtocols', []).slice(0, 3),
});

export { RecentProtocols };

export default connect(mapStateToProps)(RecentProtocols);

