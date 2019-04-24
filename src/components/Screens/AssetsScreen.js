import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../ui/components/Button';
import { Guided } from '../Guided';
import Guidance from '../Guidance';
import Card from './ProtocolCard';
import AssetBrowser from '../AssetBrowser';

const AssetBrowserScreen = ({
  show,
  transitionState,
  onComplete,
}) => {
  const buttons = [
    <Button
      key="done"
      onClick={onComplete}
      iconPosition="right"
    >
      Continue
    </Button>,
  ];

  return (
    <Card
      show={show}
      buttons={buttons}
      transitionState={transitionState}
      onAcknowledgeError={onComplete}
    >
      <Guided>
        <div className="editor variable-registry">
          <div className="editor__window">
            <div className="editor__content">
              <h1 className="editor__heading">Assets</h1>
              <p>
                Introduction to assets.
              </p>
              <Guidance contentId="guidance.screen.assets">
                <AssetBrowser />
              </Guidance>
            </div>
          </div>
        </div>
      </Guided>
    </Card>
  );
};

AssetBrowserScreen.propTypes = {
  show: PropTypes.bool,
  transitionState: PropTypes.string,
  onComplete: PropTypes.func.isRequired,
};

AssetBrowserScreen.defaultProps = {
  show: true,
  transitionState: null,
};

export { AssetBrowserScreen };

export default AssetBrowserScreen;
