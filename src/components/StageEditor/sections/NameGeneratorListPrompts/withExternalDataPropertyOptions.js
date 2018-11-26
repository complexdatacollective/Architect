import { connect } from 'react-redux';
import { get, uniq, keys } from 'lodash';
import { getExternalData, getVariableRegistry } from '../../../../selectors/protocol';

/**
 * Provides `externalDataPropertyOptions` (options) prop
 *
 * Extracts unique variables used in `dataSource`, and combines them with the registry to
 * create list of options in the format: `[ { value, label }, ...]`
 */
const mapStateToProps = (state, { dataSource, nodeType }) => {
  const externalData = get(getExternalData(state), dataSource, { nodes: [] });
  const variableRegistry = getVariableRegistry(state);

  const dataAttributes = externalData.nodes
    .filter(node => node.type === nodeType)
    .reduce((memo, node) => uniq([...memo, ...keys(node.attributes)]), []);

  const externalDataPropertyOptions = dataAttributes.map(
    (attributeId) => {
      const label = get(variableRegistry, ['node', nodeType, 'variables', attributeId, 'name']);

      if (!label) { throw new Error(`"${attributeId}" couldn't be found in variable registry.`); }

      return {
        label,
        value: attributeId,
      };
    },
  );

  return {
    externalDataPropertyOptions,
  };
};

const withExternalDataPropertyOptions = connect(mapStateToProps);

export default withExternalDataPropertyOptions;
