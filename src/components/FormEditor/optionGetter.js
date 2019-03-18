import { toPairs, fromPairs, get, map } from 'lodash';
import getInputsForType from './getInputsForType';

const allowedTypes = ['text', 'number', 'boolean', 'ordinal', 'categorical'];

const optionGetter = (variables) => {
  const allowedVariables = fromPairs(
    toPairs(variables)
      .filter(([, options]) => allowedTypes.includes(options.type)),
  );
  return (property, rowValues, allValues) => {
    const variable = get(rowValues, 'variable');
    switch (property) {
      case 'variable': {
        const used = map(allValues, 'variable');
        return map(
          allowedVariables,
          (value, id) => ({
            value: id,
            label: value.name,
            isDisabled: value !== variable && used.includes(value),
          }),
        );
      }
      case 'component':
        return getInputsForType(get(variables, [variable, 'type']));
      default:
        return [{}];
    }
  };
};

export default optionGetter;
