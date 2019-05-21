import { compose, withProps, defaultProps } from 'recompose';
import getExternalPropertiesOptionGetter from './getExternalPropertiesOptionGetter';

const defaultVariableOptions = defaultProps({
  additionalPropertiesOptionGetter: () => [],
  maxAdditionalDisplayProperties: 0,
});

const variableOptionProps = withProps(({ variableOptions }) => {
  const additionalOptions = variableOptions.filter(({ value }) => value !== 'label');
  const additionalPropertiesOptionGetter = getExternalPropertiesOptionGetter(additionalOptions);
  const maxAdditionalDisplayProperties = additionalOptions.length;

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
