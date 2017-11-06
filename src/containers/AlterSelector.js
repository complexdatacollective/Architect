import { connect } from 'react-redux';
import { toPairs, keys, flow, map, fromPairs } from 'lodash';
import { getVariableRegistry } from '../selectors/protocol';
import { AlterSelector } from '../components';

function mapStateToProps(state) {
  const variableRegistry = getVariableRegistry(state);

  const nodeAttributes = flow(
    toPairs,
    nodeTypes => map(
      nodeTypes,
      ([nodeType, options]) => [nodeType, keys(options.variables)],
    ),
    fromPairs,
  );

  console.log('alterSelector', nodeAttributes(variableRegistry.node));

  return {
    nodeTypes: keys(variableRegistry.node),
    nodeAttributes: nodeAttributes(variableRegistry.node),
  };
}

export default connect(mapStateToProps)(AlterSelector);
