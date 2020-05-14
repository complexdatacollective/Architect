import { withProps } from 'recompose';
import { get } from 'lodash';

// convert options to labels
const withDisplayOptions = withProps(({ type, options, codebook }) => {
  const entityType = type === 'alter' ? 'node' : 'edge';
  const entityRoot = type === 'ego' ? ['ego'] : [entityType, options.type];
  const typeLabel = get(codebook, [entityType, options.type, 'name'], options.type); // noop for ego
  const variableLabel = get(
    codebook,
    [...entityRoot, 'variables', options.attribute, 'name'],
    options.attribute,
  );

  const variableOptions = get(
    codebook,
    [...entityRoot, 'variables', options.attribute, 'options'],
  );

  const valueOption = variableOptions &&
    variableOptions.find(({ value }) => value === options.value);

  const value = valueOption ? valueOption.label : options.value;

  return {
    options: {
      ...options,
      ...(typeLabel ? { type: typeLabel } : {}),
      attribute: variableLabel,
      value,
    },
  };
});

export default withDisplayOptions;
