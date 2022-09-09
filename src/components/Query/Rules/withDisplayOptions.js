import { withProps } from 'recompose';
import { get } from 'lodash';

// convert options to labels
const withDisplayOptions = withProps(({ type, options, codebook }) => {
  const entityType = type === 'alter' ? 'node' : 'edge';
  const entityRoot = type === 'ego' ? ['ego'] : [entityType, options.type];
  const typeLabel = get(codebook, [entityType, options.type, 'name'], options.type); // noop for ego
  const typeColor = get(codebook, [entityType, options.type, 'color'], '#000'); // noop for ego
  const variableLabel = get(
    codebook,
    [...entityRoot, 'variables', options.attribute, 'name'],
    options.attribute,
  );

  const variableType = get(
    codebook,
    [...entityRoot, 'variables', options.attribute, 'type'],
    'string',
  );

  const variableOptions = get(
    codebook,
    [...entityRoot, 'variables', options.attribute, 'options'],
  );

  const valueOption = variableOptions
    && variableOptions.find(({ value }) => value === options.value);

  const valueWithFormatting = () => {
    const getOptionLabel = (item) => {
      const option = variableOptions.find(({ value: optionValue }) => optionValue === item);
      return option ? option.label : item;
    };

    // Fetch option label based on value if available
    switch (variableType) {
      case 'categorical':
      case 'ordinal':
        if (Array.isArray(options.value)) {
          return options.value.map(getOptionLabel);
        }

        return getOptionLabel(options.value);
      default:
        return valueOption ? valueOption.label : options.value;
    }
  };

  return {
    options: {
      ...options,
      ...(typeLabel ? { typeLabel } : {}),
      ...(typeColor ? { typeColor } : {}),
      attribute: variableLabel,
      variableType,
      value: valueWithFormatting(),
    },
  };
});

export default withDisplayOptions;
