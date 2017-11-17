import { connect } from 'react-redux';
import { keys, flow, map, fromPairs, toPairs } from 'lodash';
import { getVariableRegistry } from '../selectors/protocol';
import EdgeRule from '../components/EdgeRule';

function mapStateToProps(state) {
  const variableRegistry = getVariableRegistry(state);

  const edgeAttributes = flow(
    toPairs,
    edgeTypes => map(
      edgeTypes,
      ([edgeType, options]) => [edgeType, keys(options.variables)],
    ),
    fromPairs,
  );

  return {
    edgeTypes: keys(variableRegistry.edge),
    edgeAttributes: edgeAttributes(variableRegistry.edge),
  };
}

export default connect(mapStateToProps)(EdgeRule);
