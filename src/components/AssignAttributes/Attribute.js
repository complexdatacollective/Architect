import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@codaco/ui/lib/components/Icon';
import { compose } from 'recompose';
import * as Fields from '@codaco/ui/lib/components/Fields';
import ValidatedField from '@components/Form/ValidatedField';
import withAttributeHandlers from './withAttributeHandlers';
import withCreateVariableHandler from '../enhancers/withCreateVariableHandler';
import VariablePicker from '../Form/Fields/VariablePicker/VariablePicker';

const Attribute = ({
  field,
  variable,
  variableOptions,
  handleCreateVariable,
  handleDelete,
  entity,
  type,
}) => (
  <div className="assign-attributes-attribute">
    <div className="assign-attributes-attribute__wrapper">
      <div className="assign-attributes-attribute__variable">
        <ValidatedField
          name={`${field}.variable`}
          component={VariablePicker}
          validation={{ required: true }}
          options={variableOptions}
          onCreateOption={(value) => handleCreateVariable(value, 'boolean', `${field}.variable`)}
          entity={entity}
          type={type}
          variable={variable}
        />
      </div>
      { variable
        && (
        <fieldset className="assign-attributes-attribute__value">
          <legend>Set value of variable to:</legend>
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
        </fieldset>
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
  entity: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

Attribute.defaultProps = {
  variable: null,
};

export default compose(withAttributeHandlers, withCreateVariableHandler)(Attribute);
