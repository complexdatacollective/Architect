import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getVariableOptionsForSubject } from '../../../selectors/codebook';
import { getExternalPropertiesOptionGetter } from './optionGetters';

export const displayLabelTypes = ['text', 'number'];

const mapStateToProps = (state, { type, entity, cardOptions }) => {
  const displayLabel = cardOptions && cardOptions.displayLabel;
  const variableOptions = getVariableOptionsForSubject(state, { type, entity });
  const displayLabelOptions = variableOptions
    .filter(({ type: variableType }) => displayLabelTypes.includes(variableType));
  const additionalPropertiesOptionGetter = getExternalPropertiesOptionGetter(
    displayLabelOptions.filter(({ value }) => value !== displayLabel),
  );
  const maxAdditionalDisplayProperties = displayLabelOptions.length - 1;

  return {
    displayLabel,
    variableOptions,
    displayLabelOptions,
    additionalPropertiesOptionGetter,
    maxAdditionalDisplayProperties,
  };
};

export const propTypes = {
  displayLabel: PropTypes.string.isRequired,
  variableOptions: PropTypes.array.isRequired,
  displayLabelOptions: PropTypes.array.isRequired,
  additionalPropertiesOptionGetter: PropTypes.func.isRequired,
  maxAdditionalDisplayProperties: PropTypes.number.isRequired,
};

const withVariableOptions = connect(
  mapStateToProps,
);

export default withVariableOptions;
