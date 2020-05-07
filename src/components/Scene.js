import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { AnimatePresence } from 'framer-motion';
import { Flipper } from 'react-flip-toolkit';
import { compose, withHandlers } from 'recompose';
import { Icon } from '@codaco/ui';
import history from '@app/history';
import { getActiveProtocolMeta } from '@selectors/protocols';
import { getHasUnsavedChanges } from '@selectors/session';
import { selectors as statusSelectors } from '@modules/ui/status';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { actionLocks as protocolsLocks } from '@modules/protocols';
import Loading from '@components/Loading';
import Start from '@components/Start';
import RecentProtocols from '@components/RecentProtocols';
import { UnsavedChanges } from '@components/Dialogs';
import Overview from '@components/Overview';
import Timeline from '@components/Timeline';
import ProtocolControlBar from '@components/ProtocolControlBar';
import Screens from '@components/Screens';
import networkCanvasBrand from '@app/images/network-canvas-brand.svg';

const Scene = ({
  protocolId,
  protocolPath,
  isLoading,
  hasProtocol,
  handleClickStart,
}) => {
  const flipKey = protocolId || 'start';

  const sceneClasses = cx(
    'scene',
    { 'scene--protocol': hasProtocol },
    { 'scene--loading': isLoading },
  );

  return (
    <div className={sceneClasses}>
      <div className="scene__background scene__background--top" />
      <div className="scene__background scene__background--bottom" />
      <img className="scene__brand" src={networkCanvasBrand} alt="" />

      <div className="scene__home" onClick={handleClickStart}>
        <Icon className="start-button__arrow" name="back-arrow" />
      </div>

      <AnimatePresence>
        { isLoading && <Loading /> }
      </AnimatePresence>

      <Flipper flipKey={flipKey}>
        <div className="scene__start">
          <Start show={!hasProtocol} />
        </div>

        <div className="scene__recent-protocols">
          <RecentProtocols show={!hasProtocol} />
        </div>

        <div className="scene__protocol">
          <Overview
            show={hasProtocol}
            flipId={protocolPath && encodeURIComponent(protocolPath)}
          />

          <div className="scene__timeline">
            <Timeline show={hasProtocol} />
          </div>

          <ProtocolControlBar show={hasProtocol} />
        </div>
      </Flipper>

      <Screens />
    </div>
  );
};

Scene.propTypes = {
  protocolId: PropTypes.string,
  protocolPath: PropTypes.string,
  isLoading: PropTypes.bool,
  hasProtocol: PropTypes.bool,
  handleClickStart: PropTypes.func.isRequired,
};

Scene.defaultProps = {
  protocolId: null,
  protocolPath: null,
  isLoading: false,
  hasProtocol: false,
};

const mapStateToProps = (state) => {
  const protocolMeta = getActiveProtocolMeta(state);

  return {
    hasUnsavedChanges: getHasUnsavedChanges(state),
    protocolId: protocolMeta && protocolMeta.id,
    protocolPath: protocolMeta && protocolMeta.filePath,
    hasProtocol: !!protocolMeta,
    isLoading: statusSelectors.getIsBusy(state, protocolsLocks.loading),
  };
};

const mapDispatchToProps = {
  openDialog: dialogActions.openDialog,
};

const linkHandler = withHandlers({
  handleClickStart: ({
    hasUnsavedChanges,
    openDialog,
  }) =>
    () => Promise.resolve()
      .then(() => {
        if (!hasUnsavedChanges) { return true; }

        return openDialog(UnsavedChanges({
          message: (
            <div>
              Are you sure you want to go back to the start screen?
              <p><strong>Unsaved changes will be lost!</strong></p>
            </div>
          ),
          confirmLabel: 'Go to start screen',
        }));
      })
      .then((confirm) => {
        if (!confirm) { return; }
        history.push('/');
      }),
});

export { Scene };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  linkHandler,
)(Scene);
