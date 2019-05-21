import { compose, withProps, defaultProps } from 'recompose';
import getAdditionalPropertiesOptionGetter from './getAdditionalPropertiesOptionGetter';

const defaultVariableOptions = defaultProps({
  additionalPropertiesOptionGetter: () => [],
  maxAdditionalDisplayProperties: 0,
});

const variableOptionProps = withProps(({ variableOptions }) => {
  const additionalPropertiesOptionGetter = getAdditionalPropertiesOptionGetter(variableOptions);
  const maxAdditionalDisplayProperties = variableOptions.length;

  return {
    additionalPropertiesOptionGetter,
    maxAdditionalDisplayProperties,
  };
});

const withVariableOptions = compose(
  defaultVariableOptions,
  variableOptionProps,
);

export default withVariableOptions;
