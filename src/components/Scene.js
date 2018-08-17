import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Flipper } from 'react-flip-toolkit';
// import { get } from 'lodash';
import cx from 'classnames';
import { getActiveProtocolMeta } from '../selectors/protocol';
import Start from './Start';
import RecentProtocols from './RecentProtocols';
import Overview from './Overview';
import Timeline from './Timeline';
import networkCanvasBrand from '../images/network-canvas-brand.svg';

class Scene extends PureComponent {
  render() {
    const { protocolMeta } = this.props;
    const protocolId = protocolMeta && protocolMeta.id;

    const sceneClasses = cx(
      'scene',
      { 'scene--protocol': protocolId },
    );

    return (
      <div className={sceneClasses}>
        <div className="scene__background scene__background--top" />
        <div className="scene__background scene__background--bottom" />
        <img className="scene__brand" src={networkCanvasBrand} alt="" />
        <div className="scene__home" />

        <Flipper flipKey={protocolId}>

          <div className="scene__start">
            <Start show={!protocolId} />
          </div>

          <div className="scene__recent-protocols">
            <RecentProtocols show={!protocolId} />
          </div>

          <div className="scene__protocol">
            <Overview
              show={protocolId}
              protocolFilePath={protocolMeta && protocolMeta.filePath}
            />

            <div className="scene__timeline">
              <Timeline show={protocolId} />
            </div>
          </div>
        </Flipper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  protocolMeta: getActiveProtocolMeta(state),
});

export { Scene };

export default connect(mapStateToProps)(Scene);
