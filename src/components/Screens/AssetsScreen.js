import React from 'react';
import PropTypes from 'prop-types';
import Button from '@codaco/ui/lib/components/Button';
import Screen from '@components/Screen/Screen';
import AssetBrowser from '@components/AssetBrowser';
import Layout, { Section } from '@components/EditorLayout';

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
      icon="arrow-right"
    >
      Return to Timeline
    </Button>,
  ];

  return (
    <Screen
      show={show}
      buttons={buttons}
      transitionState={transitionState}
      onAcknowledgeError={onComplete}
    >
      <Layout>
        <Section>
          <h1>
            Assets
          </h1>
          <p>
            Welcome to the asset management screen. Here, you can load in images,
            video, audio, or even external network data which can be used elsewhere
            within your protocol.
          </p>
          <AssetBrowser />
        </Section>
      </Layout>
    </Screen>
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
