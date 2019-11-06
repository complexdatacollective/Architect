import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button, Icon } from '../ui/components';
import { actionCreators as protocolsActions } from '../ducks/modules/protocols';
import Version from './Version';
import architectLogoIcon from '../images/architect-logo-icon.svg';

const Start = ({
  show,
  createAndLoad,
  openProtocol,
}) => (
  <div className={cx('start', { 'start--hide': !show })}>
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
        icon={<Icon name="arrow-right" color="charcoal" />}
        onClick={createAndLoad}
      >Create new</Button>
      <Button
        id="open-existing-protocol-button"
        type="button"
        color="cyber-grape"
        icon={<Icon name="arrow-right" />}
        onClick={openProtocol}
      >Open existing</Button>
    </div>
  </div>
);

Start.propTypes = {
  show: PropTypes.bool,
  createAndLoad: PropTypes.func.isRequired,
  openProtocol: PropTypes.func.isRequired,
};

Start.defaultProps = {
  show: true,
};

const mapDispatchToProps = {
  createAndLoad: protocolsActions.createAndLoad,
  openProtocol: protocolsActions.openProtocol,
};

export { Start };

export default connect(null, mapDispatchToProps)(Start);
