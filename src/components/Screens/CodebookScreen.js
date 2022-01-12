import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@codaco/ui/lib/components';
import Codebook from '@components/Codebook/Codebook';
import Screen from '@components/Screen/Screen';
import { Layout } from '@components/EditorLayout';
import ControlBar from '../ControlBar';
import { motion, useElementScroll, useTransform } from 'framer-motion/dist/framer-motion';
import CollapsableHeader from '../Screen/CollapsableHeader';

const cardVariants = {
  offscreen: {
    background: 'var(--color-neon-coral)',
  },
  onscreen: {
    background: 'var(--color-sea-serpent)',
  },
};

const textVariants = {
  offscreen: {
    opacity: 0,
  },
  onscreen: {
    opacity: 1,
  },
};

const headerVariants = {
  offscreen: {
    fontSize: '1rem',
  },
  onscreen: {
    fontSize: '1.75rem',
  },
};

/**
 * This component acts as an index for types. i.e. Nodes and Edges,
 * and links to the EditType.
 */
const CodebookScreen = (props) => {
  const {
    layoutId,
    onComplete,
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
      layoutId={layoutId}
      footer={<ControlBar buttons={buttons} />}
      onComplete={onComplete}
    >
      <CollapsableHeader
        collapsedState={(
          <Layout>
            <h2>Codebook</h2>
          </Layout>
        )}
      >
        <Layout>
          <h1 className="screen-heading">Codebook</h1>
          <p>
            Below you can find an overview of the node and edge types that you have
            defined while creating your interview. Entities that are unused may be deleted.
          </p>
        </Layout>
      </CollapsableHeader>
      <Layout>
        <Codebook />
      </Layout>
    </Screen>
  );
};

CodebookScreen.propTypes = {
  layoutId: PropTypes.string,
  onComplete: PropTypes.func,
};

CodebookScreen.defaultProps = {
  layoutId: null,
  onComplete: () => {},
};

export default CodebookScreen;
