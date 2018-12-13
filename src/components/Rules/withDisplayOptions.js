import { withProps } from 'recompose';
import { get } from 'lodash';

// convert options to labels
const withDisplayOptions = withProps(({ type, options, variableRegistry }) => {
  const entityType = type === 'edge' ? 'edge' : 'node';
  const typeLabel = get(variableRegistry, [entityType, options.type, 'label'], options.type);
  const variableLabel = get(
    variableRegistry,
    [entityType, options.type, 'variables', options.variable, 'label'],
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
