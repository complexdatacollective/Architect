import PropTypes from 'prop-types';
import { compose, withProps, defaultProps } from 'recompose';
import withExternalData from '../../enhancers/withExternalData';
import { getVariablesFromExternalData } from '../../../selectors/externalData';
import getExternalPropertiesOptionGetter from './getExternalPropertiesOptionGetter';


const defaultVariableOptions = defaultProps({
  variableOptions: [],
  additionalPropertiesOptionGetter: () => [],
  maxAdditionalDisplayProperties: 0,
});

const variableOptionProps = withProps(({ externalData }) => {
  if (!externalData) { return {}; }

  const variableOptions = getVariablesFromExternalData(externalData);
  const additionalOptions = variableOptions.filter(({ value }) => value !== 'label');
  const additionalPropertiesOptionGetter = getExternalPropertiesOptionGetter(additionalOptions);
  const maxAdditionalDisplayProperties = additionalOptions.length;

  return {
    variableOptions,
    additionalPropertiesOptionGetter,
    maxAdditionalDisplayProperties,
  };
});

export const propTypes = {
  variableOptions: PropTypes.array.isRequired,
  additionalPropertiesOptionGetter: PropTypes.func.isRequired,
  maxAdditionalDisplayProperties: PropTypes.number.isRequired,
};

const withVariableOptions = compose(
  withExternalData,
  defaultVariableOptions,
  variableOptionProps,
);

export default withVariableOptions;
