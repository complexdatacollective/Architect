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

  renderProtocolList = recentProtocols => (
    <React.Fragment>
      <h3 className="recent-protocols__title" key="heading">Recently Opened Protocols</h3>
      <div className="recent-protocols__wrapper">
        {recentProtocols.map(this.renderRecentProtocol)}
      </div>
    </React.Fragment>
  );

  render() {
    const { show, recentProtocols } = this.props;

    if (!show) { return null; }

    return (
      <div className="recent-protocols">
        { (recentProtocols.length === 0) ?
          this.renderWelcomeText() : this.renderProtocolList(recentProtocols)
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  recentProtocols: get(state, 'recentProtocols', []).slice(0, 4),
});

export { RecentProtocols };

export default connect(mapStateToProps)(RecentProtocols);

