import React from 'react';
import PropTypes from 'prop-types';
import Button from '@codaco/ui/lib/components/Button';
import Screen from '@components/Screen/Screen';
import AssetBrowser from '@components/AssetBrowser';
import { Layout, Section } from '@components/EditorLayout';
import ExternalLink from '@components/ExternalLink';

const AssetBrowserScreen = ({
  layoutId,
  onComplete,
  show,
  transitionState,
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
      layoutId={layoutId}
    >
      <Layout>
        <Section title="Resource Library">
          <p>
            Welcome to the resource library. Here, you can import external data resources which
            can be used in building your protocol. These resources might include images,
            video, audio, or even external network data. See our
            {' '}
            <ExternalLink href="https://documentation.networkcanvas.com/key-concepts/resources/">documentation</ExternalLink>
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
  layoutId: PropTypes.string,
  onComplete: PropTypes.func.isRequired,
  show: PropTypes.bool,
  transitionState: PropTypes.string,
};

AssetBrowserScreen.defaultProps = {
  layoutId: null,
  show: true,
  transitionState: null,
};

export { AssetBrowserScreen };

export default AssetBrowserScreen;
