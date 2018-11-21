import { connect } from 'react-redux';
import { get, uniq, keys } from 'lodash';
import { getExternalData, getVariableRegistry } from '../../../../selectors/protocol';

const mapStateToProps = (state, { dataSource, nodeType }) => {
  const externalData = get(getExternalData(state), dataSource, { nodes: [] });
  const variableRegistry = getVariableRegistry(state);

  const dataAttributes = externalData.nodes
    .filter(node => node.type === nodeType)
    .reduce((memo, node) => uniq([...memo, ...keys(node.attributes)]), []);

  const externalDataPropertyOptions = dataAttributes.map(
    attributeId => ({
      // should we check it exists in registry? and omit if not
      label: get(variableRegistry, ['node', nodeType, 'variables', attributeId, 'name'], attributeId),
      value: attributeId,
    }),
  );

  return {
    externalDataPropertyOptions,
  };
};

const withExternalDataPropertyOptions = connect(mapStateToProps);

export default withExternalDataPropertyOptions;
