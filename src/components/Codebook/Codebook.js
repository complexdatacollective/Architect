import React from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';
import { getCodebook } from '@selectors/codebook';
import { getNodeIndex, getEdgeIndex, utils } from '@selectors/indexes';
import PropTypes from 'prop-types';
import EntityType from './EntityType';

const Codebook = ({ nodes, edges }) => (
  <div>
    <p>
      Below you can find an overview of the node and edge types that you have
      defined while creating your interview. Entities that are unused may be deleted.
    </p>

    <h2>Node Types</h2>
    <div className="editor__subsection">
      {nodes.map(node => (<EntityType {...node} />))}
    </div>

    <h2>Edge Types</h2>
    <div className="editor__subsection">
      {edges.map(edge => (<EntityType {...edge} />))}
    </div>
  </div>
);

Codebook.propTypes = {
  nodes: PropTypes.array.isRequired,
  edges: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  const codebook = getCodebook(state);

  const nodeIndex = getNodeIndex(state);
  const edgeIndex = getEdgeIndex(state);
  const nodeUsageIndex = utils.buildSearch([nodeIndex]);
  const edgeUsageIndex = utils.buildSearch([edgeIndex]);

  const nodes = map(
    codebook.node,
    (node, id) =>
      ({ entity: 'node', type: id, inUse: nodeUsageIndex.has(id) }),
  );
  const edges = map(
    codebook.edge,
    (edge, id) =>
      ({ entity: 'edge', type: id, inUse: edgeUsageIndex.has(id) }),
  );

  return {
    nodes,
    edges,
  };
};

export { Codebook };

export default connect(mapStateToProps)(Codebook);
