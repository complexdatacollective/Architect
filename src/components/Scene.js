import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Flipper } from 'react-flip-toolkit';
import cx from 'classnames';
import { NavLink } from 'react-router-dom';
import { getActiveProtocolMeta } from '../selectors/protocol';
import { Button, Icon } from '../ui/components';
import Start from './Start';
import RecentProtocols from './RecentProtocols';
import Overview from './Overview';
import Timeline from './Timeline';
import ControlBar from './ControlBar';
import Cards  from './Cards';
import architectLogoIcon from '../images/architect-logo-icon.svg';
import networkCanvasBrand from '../images/network-canvas-brand.svg';
import { actionCreators as protocolsActions } from '../ducks/modules/protocols';

const RightArrow = <Icon name="arrow-right" />;

class Scene extends PureComponent {
  get mode() {
    const protocolMeta = this.props.protocolMeta;
    return protocolMeta && protocolMeta.id ? 'protocol' : 'start';
  }
  render() {
    const {
      protocolMeta,
      location,
      saveProtocol,
      hasUnsavedChanges
    } = this.props;
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

        <NavLink className="scene__home" to="/" exact>
          <img src={architectLogoIcon} alt="" />
        </NavLink>

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

            <ControlBar show={hasUnsavedChanges}>
              <Button
                size="small"
                onClick={saveProtocol}
                color="white"
                icon={RightArrow}
                iconPosition="right"
              >
                Save
              </Button>
            </ControlBar>
          </div>
        </Flipper>

        <Cards location={location} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  protocolMeta: getActiveProtocolMeta(state),
  hasChanges: state.protocol.past.length > 0,
  hasUnsavedChanges: (state.session.lastChanged > state.session.lastSaved),
});

const mapDispatchToProps = dispatch => ({
  saveProtocol: bindActionCreators(protocolsActions.saveAndExportProtocol, dispatch),
});

export { Scene };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Scene);
