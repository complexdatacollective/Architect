import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Flipper } from 'react-flip-toolkit';
import { compose, withStateHandlers } from 'recompose';
import { getActiveProtocolMeta } from '../selectors/protocol';
import Start from './Start';
import RecentProtocols from './RecentProtocols';
import Overview from './Overview';
import Timeline from './Timeline';
import ProtocolControlBar from './ProtocolControlBar';
import Cards from './Cards';
import ExampleForm from './ExampleForm';
import architectLogoIcon from '../images/architect-logo-icon.svg';
import networkCanvasBrand from '../images/network-canvas-brand.svg';
import { actionCreators as dialogsActions } from '../ducks/modules/dialogs';

const Scene = ({
  protocolMeta,
  location,
  formOpen,
  openForm,
  closeForm,
  openDialog,
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
      <div>
        <button onClick={() => openDialog({ type: 'Notice' })}>Open notice</button>
        <button onClick={() => openDialog({ type: 'Warning' })}>Open warning</button>
        <button onClick={() => openDialog({ type: 'Confirm' })}>Open confirm</button>
        <button
          onClick={() => {
            openDialog({ type: 'Confirm' });
            openDialog({ type: 'Warning' });
            openDialog({ type: 'Notice' });
          }}
        >Open lots of dialogs</button>
        <button onClick={() => openForm()}>Open form</button>
      </div>

      <ExampleForm
        show={formOpen}
        onComplete={() => {
          // Form specific callback, probably also changes state of formOpen
          closeForm();
        }}
      />

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

const mapDispatchToProps = dispatch => ({
  openDialog: dialog => dispatch(dialogsActions.openDialog(dialog)),
});

const testStateHandlers = withStateHandlers(
  {
    formOpen: false,
  },
  {
    openForm: () =>
      () => ({
        formOpen: true,
      }),
    closeForm: () =>
      () => ({
        formOpen: false,
      }),
  },
);

export { Scene };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  testStateHandlers,
)(Scene);
