import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button, Icon } from '../ui/components';
import { actionCreators as protocolsActions } from '../ducks/modules/protocols';
import Version from './Version';

const Start = ({
  show,
  createAndLoadProtocol,
  openProtocol,
}) => (
  <div className={cx('start', { 'start--hide': !show })}>
    <div className="start__welcome">
      <h1 className="start__welcome-title">Architect</h1>
      <h2 className="start__welcome-lead">A tool for creating Network Canvas interviews</h2>
      <Version />
    </div>

    <div className="start__call-to-action">
      <Button
        id="create-new-protocol-button"
        type="button"
        color="platinum"
        icon={<Icon name="arrow-right" color="charcoal" />}
        onClick={createAndLoadProtocol}
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
  createAndLoadProtocol: PropTypes.func.isRequired,
  openProtocol: PropTypes.func.isRequired,
};

Start.defaultProps = {
  show: true,
};

const mapDispatchToProps = dispatch => ({
  createAndLoadProtocol: bindActionCreators(protocolsActions.createAndLoadProtocol, dispatch),
  openProtocol: bindActionCreators(protocolsActions.openProtocol, dispatch),
});

export { Start };

export default connect(null, mapDispatchToProps)(Start);
