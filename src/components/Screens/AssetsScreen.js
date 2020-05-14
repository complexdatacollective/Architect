import React from 'react';
import PropTypes from 'prop-types';
import Button from '@codaco/ui/lib/components/Button';
import Screen from '@components/Screen/Screen';
import AssetBrowser from '@components/AssetBrowser';
import SectionsContainer from '@components/sections/SectionsContainer';
import Section from '@components/sections/Section';
import SectionsHeading from '@components/sections/SectionsHeading';

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
    <Screen
      show={show}
      buttons={buttons}
      transitionState={transitionState}
      onAcknowledgeError={onComplete}
    >
      <SectionsContainer>
        <SectionsHeading>
            Assets
        </SectionsHeading>
        <Section>
          <p>
            Welcome to the asset management screen. Here, you can load in images,
            video, audio, or even external network data which can be used elsewhere
            within your protocol.
          </p>
          <AssetBrowser />
        </Section>
      </SectionsContainer>
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
