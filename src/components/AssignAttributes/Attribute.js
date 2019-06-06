import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ValidatedField from '../Form/ValidatedField';
import Icon from '../../ui/components/Icon';
import * as Fields from '../../ui/components/Fields';
import { getComponentsForType } from '../Form/inputOptions';
import Select from '../Form/Fields/Select';
import withVariableMeta from './withVariableMeta';

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
  index,
  variableType,
  options,
  onCreateNew,
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
          onCreateNew={() => { onCreateNew(index); }}
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
        onClick={() => handleDelete(index)}
      >
        <Icon name="delete" />
      </div>
    </div>
  );
};

Attribute.propTypes = {
  field: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  variableType: PropTypes.string,
  options: PropTypes.array,
  onCreateNew: PropTypes.func.isRequired,
  variableOptions: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

Attribute.defaultProps = {
  variableType: null,
  options: [],
};

export { Attribute };

export default withVariableMeta(Attribute);
