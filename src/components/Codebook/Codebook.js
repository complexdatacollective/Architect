import React from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';
import { getCodebook } from '@selectors/codebook';
import { getNodeIndex, getEdgeIndex, utils } from '@selectors/indexes';
import PropTypes from 'prop-types';
import EntityType from './EntityType';

const CodebookCategory = ({ title, children }) => (
  <div className="codebook__category">
    <h1>{title}</h1>
    <div className="codebook__category-items">
      {children}
    </div>
  </div>
);

const Codebook = ({ nodes, edges }) => (
  <div className="codebook">
    <p>
      Below you can find an overview of the node and edge types that you have
      defined while creating your interview. Entities that are unused may be deleted.
    </p>

    { nodes.length > 0 &&
      <CodebookCategory title="Node Types">
        {nodes.map(node => (<EntityType {...node} />))}
      </CodebookCategory>
    }

    { edges.length > 0 &&
      <CodebookCategory title="Edge Types">
        {edges.map(edge => (<EntityType {...edge} />))}
      </CodebookCategory>
    }
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
