import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose, withProps } from 'recompose';
import { getVariableOptionsForSubject } from '@selectors/codebook';
import { Button } from '@codaco/ui';
import RenameVariableControl from '@components/RenameVariableControl';
import NativeSelect from './NativeSelect';

const withVariableValidator = withProps(({ validation }) => ({
  validation: { ...validation, allowedVariableName: 'variable name' },
}));

const mapStateToProps = (state, { entity, type }) => {
  const existingVariables = getVariableOptionsForSubject(state, { entity, type });

  return { reserved: existingVariables };
};

// TODO: For now just map existing variables, but later could also append create handlers!
const VariableSelect = ({
  reserved,
  entity,
  type,
  variable,
  ...props
}) => (
  <>
    <NativeSelect
      placeholder="Select or create a variable"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      reserved={reserved}
    />
    { variable && (
      <RenameVariableControl
        entity={entity}
        type={type}
        id={variable}
      >
        {({ onClick }) => (
          <Button
            onClick={onClick}
            size="small"
            color="white"
          >
            Rename variable
          </Button>
        )}
      </RenameVariableControl>
    )}
  </>
);

VariableSelect.propTypes = {
  entity: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  reserved: PropTypes.array,
  type: PropTypes.string,
  variable: PropTypes.string,
};

VariableSelect.defaultProps = {
  reserved: [],
  entity: null,
  type: null,
  variable: null,
};

export default compose(
  connect(mapStateToProps, {}),
  withVariableValidator,
)(VariableSelect);
