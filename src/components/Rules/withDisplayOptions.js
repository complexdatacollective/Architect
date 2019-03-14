import { withProps } from 'recompose';
import { get } from 'lodash';

// convert options to labels
const withDisplayOptions = withProps(({ type, options, codebook }) => {
  const entityType = type === 'alter' ? 'node' : 'edge';
  const entityRoot = type === 'ego' ? ['ego'] : [entityType, options.type];
  const typeLabel = get(codebook, [entityType, options.type, 'label'], options.type); // noop for ego
  const variableLabel = get(
    codebook,
    [...entityRoot, 'variables', options.variable, 'label'],
    options.variable,
  );

  return {
    options: {
      ...options,
      type: typeLabel,
      variable: variableLabel,
    },
  };
});

export default withDisplayOptions;
