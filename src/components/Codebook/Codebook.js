import React from 'react';
import { connect } from 'react-redux';
import { map, isEmpty } from 'lodash';
import { getCodebook } from '@selectors/codebook';
import { getNodeIndex, getEdgeIndex, utils } from '@selectors/indexes';
import { getNetworkAssets } from '@selectors/protocol';
import PropTypes from 'prop-types';
import EntityType from './EntityType';
import ExternalEntity from './ExternalEntity';
import EgoType from './EgoType';
import CodebookCategory from './CodebookCategory';
import { getUsage, getUsageAsStageMeta } from './helpers';

const Codebook = ({
  edges,
  hasEdges,
  hasEgoVariables,
  hasNetworkAssets,
  hasNodes,
  networkAssets,
  nodes,
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

    { hasNetworkAssets &&
      <CodebookCategory title="Network Assets">
        {networkAssets.map(
          networkAsset => (
            <ExternalEntity
              source={networkAsset.source}
              name={networkAsset.name}
              key={networkAsset.name}
            />
          ),
        )}
      </CodebookCategory>
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
  edges: PropTypes.array.isRequired,
  hasEdges: PropTypes.bool.isRequired,
  hasEgoVariables: PropTypes.bool.isRequired,
  hasNetworkAssets: PropTypes.bool.isRequired,
  hasNodes: PropTypes.bool.isRequired,
  networkAssets: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired,
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

  const networkAssets = Object.values(getNetworkAssets(state));

  const hasEgoVariables = !isEmpty(codebook.ego);
  const hasNodes = nodes.length > 0;
  const hasEdges = edges.length > 0;
  const hasNetworkAssets = networkAssets.length > 0;

  return {
    edges,
    hasEdges,
    hasEgoVariables,
    hasNetworkAssets,
    hasNodes,
    networkAssets,
    nodes,
  };
};

export { Codebook };

export default connect(mapStateToProps)(Codebook);
