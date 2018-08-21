import React from 'react';
import cx from 'classnames';
import { Button, Icon } from '../ui/components';

const Welcome = ({ show, createAndLoadProtocol, openProtocol }) => (
  <div className={cx('start', { 'start--hide': !show })}>
    <div className="start__welcome">
      <h1 className="start__welcome-title">Architect</h1>
      <h2 className="start__welcome-lead">A tool for creating Network Canvas interviews</h2>
    </div>

    <div className="start__call-to-action">
      <Button
        id="create-new-protocol-button"
        type="button"
        color="platinum"
        size="small"
        icon={<Icon name="arrow-right" color="charcoal" />}
        onClick={createAndLoadProtocol}
      >Create new</Button>
      <Button
        id="open-existing-protocol-button"
        type="button"
        size="small"
        color="cyber-grape"
        icon={<Icon name="arrow-right" />}
        onClick={openProtocol}
      >Open existing</Button>
    </div>
  </div>
);

Welcome.defaultProps = {
  createAndLoadProtocol: () => {},
  openProtocol: () => {},
};

export default Welcome;
