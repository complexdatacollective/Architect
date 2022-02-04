import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@codaco/ui/lib/components';
import Codebook from '@components/Codebook/Codebook';
import Screen from '@components/Screen/Screen';
import { Layout } from '@components/EditorLayout';
import ControlBar from '../ControlBar';
import CollapsableHeader from '../Screen/CollapsableHeader';

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
      color="platinum"
    >
      Close
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
          <div className="stage-heading stage-heading--collapsed stage-heading--shadow">
            <Layout>
              <h2>Codebook</h2>
            </Layout>
          </div>
        )}
      >
        <div className="stage-heading stage-heading--inline">
          <Layout>
            <h1 className="screen-heading">Codebook</h1>
            <p>
              Below you can find an overview of the node and edge types that you have
              defined while creating your interview. Entities that are unused may be deleted.
            </p>
          </Layout>
        </div>
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
