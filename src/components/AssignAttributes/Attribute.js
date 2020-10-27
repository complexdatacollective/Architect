import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Icon from '@codaco/ui/lib/components/Icon';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { getComponentsForType } from '@app/config/variables';
import ValidatedField from '@components/Form/ValidatedField';
import NativeSelect from '@components/Form/Fields/NativeSelect';
import withAttributeHandlers from './withAttributeHandlers';

const getInputComponentForType = (type) => {
  const components = getComponentsForType(type);
  const componentName = get(components, [0, 'value']); // Use the first possible option
  return Fields[componentName];
};

const getValidationForType = (type) => {
  if (type !== 'categorical') { return { required: true }; }
  return {
    minSelected: 1,
    required: true,
  };
};

const Attribute = ({
  field,
  handleDelete,
  variableType,
  options,
  handleCreateNew,
  variableOptions,
}) => {
  const ValueComponent = variableType && getInputComponentForType(variableType);

  return (
    <div className="assign-attributes-attribute">
      <div className="assign-attributes-attribute__variable">
        <ValidatedField
          name={`${field}.variable`}
          label="Variable:"
          component={NativeSelect}
          options={variableOptions}
          onCreateNew={handleCreateNew}
          disabled={!!variableType}
          validation={{ required: true }}
        />
      </div>
      <div className="assign-attributes-attribute__value">
        { variableType &&
          <React.Fragment>
            <h4>Value:</h4>
            <ValidatedField
              name={`${field}.value`}
              component={ValueComponent}
              options={options}
              validation={getValidationForType(variableType)}
            />
          </React.Fragment>
        }
      </div>
      <div
        className="assign-attributes-attribute__delete"
        onClick={handleDelete}
      >
        <Icon name="delete" />
      </div>
    </div>
  );
};

Attribute.propTypes = {
  field: PropTypes.string.isRequired,
  variableType: PropTypes.string,
  options: PropTypes.array,
  variableOptions: PropTypes.array.isRequired,
  handleCreateNew: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

Attribute.defaultProps = {
  variableType: null,
  options: [],
};

export { Attribute };

export default withAttributeHandlers(Attribute);
