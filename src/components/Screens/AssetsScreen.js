import React from 'react';
import PropTypes from 'prop-types';
import Button from '@codaco/ui/lib/components/Button';
import Screen from '@components/Screen/Screen';
import AssetBrowser from '@components/AssetBrowser';
import { Layout, Section } from '@components/EditorLayout';
import ExternalLink from '../ExternalLink';

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
            Resource Library
          </h1>
          <p>
            Welcome to the resource library. Here, you can import external data resources which
            can be used in building your protocol. These resources might include images,
            video, audio, or even external network data. See our
            {' '}
            <ExternalLink href="https://documentation.networkcanvas.com/reference/key-concepts/resources/">documentation</ExternalLink>
            {' '}
            for more information.
          </p>
        </Section>
        <AssetBrowser />
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
