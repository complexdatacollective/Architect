import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@codaco/ui/lib/components/Icon';
import { compose } from 'recompose';
import * as Fields from '@codaco/ui/lib/components/Fields';
import ValidatedField from '@components/Form/ValidatedField';
import VariableSelect from '@components/Form/Fields/VariableSelect';
import withAttributeHandlers from './withAttributeHandlers';
import withCreateVariableHandler from '../enhancers/withCreateVariableHandler';

const Attribute = ({
  field,
  variable,
  variableOptions,
  handleCreateVariable,
  handleDelete,
}) => (
  <div className="assign-attributes-attribute">
    <div className="assign-attributes-attribute__wrapper">
      <div className="assign-attributes-attribute__variable">
        <ValidatedField
          name={`${field}.variable`}
          label="Variable:"
          component={VariableSelect}
          validation={{ required: true }}
          options={variableOptions}
          onCreateOption={(value) => handleCreateVariable(value, 'boolean', `${field}.variable`)}
        />
      </div>
      { variable
        && (
        <div className="assign-attributes-attribute__value">
          <h4>Value:</h4>
          <ValidatedField
            name={`${field}.value`}
            options={[
              { label: 'True', value: true },
              { label: 'False', value: false, negative: true },
            ]}
            component={Fields.Boolean}
            validation={{ required: true }}
            noReset
          />
        </div>
        )}
    </div>
    <div
      className="assign-attributes-attribute__delete"
      onClick={handleDelete}
    >
      <Icon name="delete" />
    </div>
  </div>
);

Attribute.propTypes = {
  field: PropTypes.string.isRequired,
  variable: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  variableOptions: PropTypes.array.isRequired,
  handleCreateVariable: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

Attribute.defaultProps = {
  variable: null,
};

export default compose(withAttributeHandlers, withCreateVariableHandler)(Attribute);
