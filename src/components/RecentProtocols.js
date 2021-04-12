import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Flipped } from 'react-flip-toolkit';
import PropTypes from 'prop-types';
import ProtocolStack from './ProtocolStack';

const getRecentProtocols = (state) => get(state, 'recentProtocols', [])
  .slice(0, 4);

class RecentProtocols extends Component {
  renderRecentProtocol = (protocol) => (
    <div
      key={encodeURIComponent(protocol.filePath)}
      className="recent-protocols__protocol"
    >
      <Flipped flipId={encodeURIComponent(protocol.filePath)}>
        <ProtocolStack
          protocol={protocol}
        />
      </Flipped>
    </div>
  );

  renderWelcomeText = () => (
    <div className="recent-protocols__welcome">
      <h1>Getting Started</h1>
      <p>
        Welcome to Network Canvas Architect! To get started, use the buttons above to create a new
        interview protocol, or open an existing one from elsewhere. When you return to this screen
        later, recent protocols you have opened will be shown here.
      </p>
    </div>
  );

  renderProtocolList = (recentProtocols) => (
    <>
      <h3 className="recent-protocols__title" key="heading">Recently Opened Protocols</h3>
      <div className="recent-protocols__wrapper">
        {recentProtocols.map(this.renderRecentProtocol)}
      </div>
    </>
  );

  render() {
    const { show, recentProtocols } = this.props;

    if (!show) { return null; }

    return (
      <div className="recent-protocols">
        { (recentProtocols.length === 0)
          ? this.renderWelcomeText() : this.renderProtocolList(recentProtocols)}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  recentProtocols: getRecentProtocols(state),
});

RecentProtocols.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  recentProtocols: PropTypes.array.isRequired,
  show: PropTypes.bool,
};

RecentProtocols.defaultProps = {
  show: true,
};

export { RecentProtocols as UnconnectedRecentProtocols };

export default connect(mapStateToProps)(RecentProtocols);
