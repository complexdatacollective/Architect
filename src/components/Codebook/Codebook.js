import React from 'react';
import { connect } from 'react-redux';
import { map, isEmpty } from 'lodash';
import { getCodebook } from '@selectors/codebook';
import { getNodeIndex, getEdgeIndex, utils } from '@selectors/indexes';
import PropTypes from 'prop-types';
import EntityType from './EntityType';
import EgoType from './EgoType';
import CodebookCategory from './CodebookCategory';
import { getUsage, getUsageAsStageMeta } from './helpers';

const Codebook = ({
  nodes,
  edges,
  hasEgoVariables,
  hasNodes,
  hasEdges,
}) => (
  <div className="codebook">
    <p>
      Below you can find an overview of the node and edge types that you have
      defined while creating your interview. Entities that are unused may be deleted.
    </p>

    { !hasEgoVariables && !hasNodes && !hasEdges &&
      <p className="codebook__notice">
        There are currently no types or variables defined in this protocol.
        When you have created some interview stages, the types and variables will be shown here.
      </p>
    }

    { hasEgoVariables &&
      <CodebookCategory title="Ego">
        <EgoType entity="ego" type="ego" />
      </CodebookCategory>
    }

    { hasNodes &&
      <CodebookCategory title="Node Types">
        {nodes.map(node => <EntityType {...node} key={node.type} />)}
      </CodebookCategory>
    }

    { hasEdges &&
      <CodebookCategory title="Edge Types">
        {edges.map(edge => <EntityType {...edge} key={edge.type} />)}
      </CodebookCategory>
    }
  </div>
);

Codebook.propTypes = {
  nodes: PropTypes.array.isRequired,
  edges: PropTypes.array.isRequired,
  hasEgoVariables: PropTypes.bool.isRequired,
  hasNodes: PropTypes.bool.isRequired,
  hasEdges: PropTypes.bool.isRequired,
};

const getEntityWithUsage = (state, index, mergeProps) => {
  const search = utils.buildSearch([index]);

  return (_, id) => {
    const inUse = search.has(id);

    const usage = inUse ?
      getUsageAsStageMeta(state, getUsage(index, id)) :
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

  const hasEgoVariables = !isEmpty(codebook.ego);
  const hasNodes = nodes.length > 0;
  const hasEdges = edges.length > 0;

  return {
    nodes,
    edges,
    hasEgoVariables,
    hasNodes,
    hasEdges,
  };
};

export { Codebook };

export default connect(mapStateToProps)(Codebook);
