import { compose, withProps, defaultProps } from 'recompose';
import getVariableOptionsGetter from './getVariableOptionsGetter';

const defaultVariableOptions = defaultProps({
  variableOptionsGetter: () => [],
  maxVariableOptions: 0,
});

const variableOptionGetterProps = withProps(({ variableOptions }) => {
  const variableOptionsGetter = getVariableOptionsGetter(variableOptions);
  const maxVariableOptions = variableOptions.length;

  return {
    variableOptionsGetter,
    maxVariableOptions,
  };
});

const withVariableOptionsGetter = compose(
  defaultVariableOptions,
  variableOptionGetterProps,
);

export default withVariableOptionsGetter;
