import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Flipper } from 'react-flip-toolkit';
import { compose, withHandlers } from 'recompose';
import { getActiveProtocolMeta } from '../selectors/protocol';
import { actionCreators as dialogActions } from '../ducks/modules/dialogs';
import history from '../history';
import Start from './Start';
import RecentProtocols from './RecentProtocols';
import Overview from './Overview';
import Timeline from './Timeline';
import ProtocolControlBar from './ProtocolControlBar';
import Screens from './Screens';
import architectLogoIcon from '../images/architect-logo-icon.svg';
import networkCanvasBrand from '../images/network-canvas-brand.svg';

const Scene = ({
  protocolMeta,
  handleClickStart,
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

      <div onClick={handleClickStart} className="scene__home">
        <img src={architectLogoIcon} alt="" />
      </div>

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

      <Screens />
    </div>
  );
};

Scene.propTypes = {
  protocolMeta: PropTypes.object,
  handleClickStart: PropTypes.func.isRequired,
};

Scene.defaultProps = {
  protocolMeta: null,
};

const mapStateToProps = state => ({
  hasUnsavedChanges: (state.session.lastChanged > state.session.lastSaved),
  protocolMeta: getActiveProtocolMeta(state),
});

const mapDispatchToProps = dispatch => ({
  openDialog: bindActionCreators(dialogActions.openDialog, dispatch),
});

const linkHandler = withHandlers({
  handleClickStart: ({ hasUnsavedChanges, openDialog }) => () => {
    const goToStartScreen = () => history.push('/');
    if (!hasUnsavedChanges) { goToStartScreen(); return; }
    openDialog({
      type: 'Warning',
      title: 'Unsaved changes',
      message: (
        <div>
          Are you sure you want to go back to the start screen?
          <p><strong>Any unsaved changes will be lost!</strong></p>
        </div>
      ),
      confirmLabel: 'Go to start screen',
      onConfirm: goToStartScreen,
    });
  },
});

export { Scene };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  linkHandler,
)(Scene);
