import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose, withProps } from 'recompose';
import { getVariableOptionsForSubject } from '@selectors/codebook';
import NativeSelect from './NativeSelect';

const withVariableValidator = withProps(({ validation }) => ({
  validation: { ...validation, allowedVariableName: 'variable name' },
}));

const mapStateToProps = (state, { entity, type }) => {
  const existingVariables = getVariableOptionsForSubject(state, { entity, type });

  return { reserved: existingVariables };
};

// TODO: For now just map existing variables, but later could also append create handlers!
const VariableSelect = ({ reserved, ...props }) => (
  <NativeSelect
    placeholder="Select or create a variable"
    {...props}
    reserved={reserved}
  />
);

VariableSelect.propTypes = {
  entity: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  reserved: PropTypes.array,
  type: PropTypes.string,
};

VariableSelect.defaultProps = {
  reserved: [],
  entity: null,
  type: null,
};

export default compose(
  connect(mapStateToProps, {}),
  withVariableValidator,
)(VariableSelect);
