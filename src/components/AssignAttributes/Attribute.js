import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ValidatedField from '../Form/ValidatedField';
import Icon from '../../ui/components/Icon';
import * as Fields from '../../ui/components/Fields';
import { getComponentsForType } from '../Form/inputOptions';
import Select from '../Form/Fields/Select';
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
          component={Select}
          options={variableOptions}
          onCreateNew={handleCreateNew}
          isDisabled={!!variableType}
          createNewOption="Create new variable"
          validation={{ required: true }}
        />
      </div>
      <div className="assign-attributes-attribute__value">
        { variableType &&
          <ValidatedField
            name={`${field}.value`}
            component={ValueComponent}
            options={options}
            validation={getValidationForType(variableType)}
          />
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
