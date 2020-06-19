import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose, withProps } from 'recompose';
import { getVariableOptionsForSubject } from '@selectors/codebook';
import CreatableSelect from './CreatableSelect';

const withVariableValidator = withProps(({ validation }) => ({
  validation: { ...validation, allowedVariableName: true },
}));

const mapStateToProps = (state, { entity, type }) => {
  const existingVariables = getVariableOptionsForSubject(state, { entity, type });

  return { reserved: existingVariables };
};

// TODO: For now just map existing variables, but later could also append create handlers!
const VariableSelect = ({ reserved, ...props }) => (
  <CreatableSelect {...props} reserved={reserved} />
);

VariableSelect.propTypes = {
  entity: PropTypes.string.isRequired,
  reserved: PropTypes.array,
  type: PropTypes.string.isRequired,
};

VariableSelect.defaultProps = {
  reserved: [],
};

export default compose(
  connect(mapStateToProps),
  withVariableValidator,
)(VariableSelect);
