import PropTypes from 'prop-types';
import { compose, withProps, defaultProps } from 'recompose';
import { getNetworkAssetVariables } from '@selectors/assets';

const defaultVariableOptions = defaultProps({
  variableOptions: [],
});

const variableOptionProps = withProps(({ externalData }) => {
  if (!externalData) { return {}; }

  const variableOptions = getNetworkAssetVariables(externalData);

  return {
    variableOptions,
  };
});

export const propTypes = {
  variableOptions: PropTypes.array.isRequired,
};

const withVariableOptions = compose(
  defaultVariableOptions,
  variableOptionProps,
);

export default withVariableOptions;
