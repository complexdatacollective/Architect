import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@codaco/ui/lib/components';
import Codebook from '@components/Codebook/Codebook';
import Screen from '@components/Screen/Screen';
import { Layout, Section } from '@components/EditorLayout';

/**
 * This component acts as an index for types. i.e. Nodes and Edges,
 * and links to the EditType.
 */
const CodebookScreen = (props) => {
  const {
    layoutId,
    onComplete,
    show,
    transitionState,
  } = props;

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
        <Section title="Codebook">
          <p>
            Below you can find an overview of the node and edge types that you have
            defined while creating your interview. Entities that are unused may be deleted.
          </p>
        </Section>
        <Codebook />
      </Layout>
    </Screen>
  );
};

CodebookScreen.propTypes = {
  layoutId: PropTypes.string,
  onComplete: PropTypes.func,
  show: PropTypes.bool,
  transitionState: PropTypes.string,
};

CodebookScreen.defaultProps = {
  layoutId: null,
  onComplete: () => {},
  show: true,
  transitionState: null,
};

export default CodebookScreen;
