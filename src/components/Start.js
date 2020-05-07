import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button, Icon } from '@codaco/ui';
import { actionCreators as protocolsActions } from '@modules/protocols';
import architectLogoIcon from '@app/images/architect-logo-icon.svg';
import Version from './Version';

const states = {
  BUSY: Symbol('BUSY'),
  READY: Symbol('READY'),
};

const Start = ({
  show,
  createAndLoadProtocol,
  openProtocol,
}) => {
  const [state, setState] = useState(states.READY);

  const handleOpenProtocol = useCallback(() => {
    setState(states.BUSY);
    openProtocol().finally(() => setState(states.READY));
  }, [openProtocol, setState]);

  const handleCreateProtocol = useCallback(() => {
    setState(states.BUSY);
    createAndLoadProtocol().finally(() => setState(states.READY));
  }, [createAndLoadProtocol, setState]);

  const disableButtons = state !== states.READY;

  const classNames = cx(
    'start',
    {
      'start--hide': !show,
    },
  );

  return (
    <div className={classNames}>
      <div className="start__welcome">
        <div className="start__welcome-logo">
          <img src={architectLogoIcon} alt="" />
        </div>
        <div>
          <h1 className="start__welcome-title">Architect</h1>
          <h2 className="start__welcome-lead">A tool for creating Network Canvas interviews</h2>
          <Version />
        </div>

      </div>

      <div className="start__call-to-action">
        <Button
          id="create-new-protocol-button"
          type="button"
          color="platinum"
          disabled={disableButtons}
          icon={<Icon name="arrow-right" color="charcoal" />}
          onClick={handleCreateProtocol}
        >Create new</Button>
        <Button
          id="open-existing-protocol-button"
          type="button"
          color="cyber-grape"
          disabled={disableButtons}
          icon={<Icon name="arrow-right" />}
          onClick={handleOpenProtocol}
        >Open existing</Button>
      </div>
    </div>
  );
};

Start.propTypes = {
  show: PropTypes.bool,
  createAndLoadProtocol: PropTypes.func.isRequired,
  openProtocol: PropTypes.func.isRequired,
};

Start.defaultProps = {
  show: true,
};

const mapDispatchToProps = {
  createAndLoadProtocol: protocolsActions.createAndLoadProtocol,
  openProtocol: protocolsActions.openProtocol,
};

export { Start };

export default connect(null, mapDispatchToProps)(Start);
