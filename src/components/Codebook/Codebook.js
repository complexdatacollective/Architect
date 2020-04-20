import React from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';
import { getCodebook } from '@selectors/codebook';
import { getNodeIndex, getEdgeIndex, utils } from '@selectors/indexes';
import PropTypes from 'prop-types';
import EntityType from './EntityType';
import EgoType from './EgoType';
import CodebookCategory from './CodebookCategory';
import { getUsage, getUsageAsStageName } from './helpers';

const Codebook = ({ nodes, edges }) => (
  <div className="codebook">
    <p>
      Below you can find an overview of the node and edge types that you have
      defined while creating your interview. Entities that are unused may be deleted.
    </p>

    <CodebookCategory title="Ego">
      <EgoType entity="ego" type="ego" />
    </CodebookCategory>

    { nodes.length > 0 &&
      <CodebookCategory title="Node Types">
        {nodes.map(node => <EntityType {...node} key={node.type} />)}
      </CodebookCategory>
    }

    { edges.length > 0 &&
      <CodebookCategory title="Edge Types">
        {edges.map(edge => <EntityType {...edge} key={edge.type} />)}
      </CodebookCategory>
    }
  </div>
);

Codebook.propTypes = {
  nodes: PropTypes.array.isRequired,
  edges: PropTypes.array.isRequired,
};

const getEntityWithUsage = (state, index, mergeProps) => {
  const search = utils.buildSearch([index]);

  return (_, id) => {
    const inUse = search.has(id);

    const usage = inUse ?
      getUsageAsStageName(state, getUsage(index, id)) :
      [];

    return {
      ...mergeProps,
      type: id,
      inUse,
      usage,
    };
  };
};

const mapStateToProps = (state) => {
  const codebook = getCodebook(state);

  const nodeIndex = getNodeIndex(state);
  const edgeIndex = getEdgeIndex(state);

  const nodes = map(
    codebook.node,
    getEntityWithUsage(state, nodeIndex, { entity: 'node' }),
  );
  const edges = map(
    codebook.edge,
    getEntityWithUsage(state, edgeIndex, { entity: 'edge' }),
  );

  return {
    nodes,
    edges,
  };
};

export { Codebook };

export default connect(mapStateToProps)(Codebook);
