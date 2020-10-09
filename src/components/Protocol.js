import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { getActiveProtocolMeta } from '@selectors/protocols';
import { getHasUnsavedChanges } from '@selectors/session';
import { selectors as statusSelectors } from '@modules/ui/status';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { actionLocks as protocolsLocks } from '@modules/protocols';
import Overview from '@components/Overview';
import Timeline from '@components/Timeline';
import ProtocolControlBar from '@components/ProtocolControlBar';

const Protocol = ({
  isLoading,
  hasProtocol,
}) => {
  const sceneClasses = cx(
    'scene',
    { 'scene--protocol': hasProtocol },
    { 'scene--loading': isLoading },
  );

  return (
    <div className={sceneClasses}>
      <div className="scene__protocol">
        <Overview
          show={hasProtocol}
        />

        <div className="scene__timeline">
          <Timeline show={hasProtocol} />
        </div>
      </div>
      <ProtocolControlBar show={hasProtocol} />
    </div>
  );
};

Protocol.propTypes = {
  protocolPath: PropTypes.string,
  isLoading: PropTypes.bool,
  hasProtocol: PropTypes.bool,
};

Protocol.defaultProps = {
  protocolPath: null,
  isLoading: false,
  hasProtocol: false,
};

const mapStateToProps = (state) => {
  const protocolMeta = getActiveProtocolMeta(state);

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

export { Protocol };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Protocol);
