import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Flipper } from 'react-flip-toolkit';
import { getActiveProtocolMeta } from '../selectors/protocol';
import Start from './Start';
import RecentProtocols from './RecentProtocols';
import Overview from './Overview';
import Timeline from './Timeline';
import ProtocolControlBar from './ProtocolControlBar';
import Cards from './Cards';
import architectLogoIcon from '../images/architect-logo-icon.svg';
import networkCanvasBrand from '../images/network-canvas-brand.svg';

const Scene = ({
  protocolMeta,
  location,
}) => {
  const protocolId = protocolMeta && protocolMeta.id;
  const flipKey = protocolId || 'start';
  const showProtocol = !!protocolId;
  const showStart = !protocolId;

  const sceneClasses = cx(
    'scene',
    { 'scene--protocol': showProtocol },
  );

  return (
    <div className={sceneClasses}>
      <div className="scene__background scene__background--top" />
      <div className="scene__background scene__background--bottom" />
      <img className="scene__brand" src={networkCanvasBrand} alt="" />

      <NavLink className="scene__home" to="/" exact>
        <img src={architectLogoIcon} alt="" />
      </NavLink>

      <Flipper flipKey={flipKey}>

        <div className="scene__start">
          <Start show={showStart} />
        </div>

        <div className="scene__recent-protocols">
          <RecentProtocols show={showStart} />
        </div>

        <div className="scene__protocol">
          <Overview
            show={showProtocol}
            flipId={protocolMeta && protocolMeta.filePath}
          />

          <div className="scene__timeline">
            <Timeline show={showProtocol} />
          </div>

          <ProtocolControlBar show={showProtocol} />
        </div>
      </Flipper>

      <Cards location={location} />
    </div>
  );
};

Scene.propTypes = {
  protocolMeta: PropTypes.object,
  location: PropTypes.object.isRequired,
};

Scene.defaultProps = {
  protocolMeta: null,
};

const mapStateToProps = state => ({
  protocolMeta: getActiveProtocolMeta(state),
});

export { Scene };

export default connect(
  mapStateToProps,
)(Scene);
