import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { Icon } from '@codaco/ui';
import history from '@app/history';
import { getActiveProtocolMeta } from '@selectors/protocols';
import { getHasUnsavedChanges } from '@selectors/session';
import { selectors as statusSelectors } from '@modules/ui/status';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { actionLocks as protocolsLocks } from '@modules/protocols';
import { UnsavedChanges } from '@components/Dialogs';
import Overview from '@components/Overview';
import Timeline from '@components/Timeline';
import ProtocolControlBar from '@components/ProtocolControlBar';
import Screens from '@components/Screens';
import networkCanvasBrand from '@app/images/network-canvas-brand.svg';

const Scene = ({
  protocolPath,
  isLoading,
  hasProtocol,
  handleClickStart,
}) => {
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

      <Screens />
    </div>
  );
};

Scene.propTypes = {
  protocolPath: PropTypes.string,
  isLoading: PropTypes.bool,
  hasProtocol: PropTypes.bool,
  handleClickStart: PropTypes.func.isRequired,
};

Scene.defaultProps = {
  protocolPath: null,
  isLoading: false,
  hasProtocol: false,
};

const mapStateToProps = (state) => {
  const protocolMeta = getActiveProtocolMeta(state);

  console.log({
    isLoading: statusSelectors.getIsBusy(state, protocolsLocks.loading),
  });

  return {
    hasUnsavedChanges: getHasUnsavedChanges(state),
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
