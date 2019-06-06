import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Field } from 'redux-form';
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
        <Field
          name={`${field}.variable`}
          component={Select}
          options={variableOptions}
          onCreateNew={() => { onCreateNew(index); }}
          isDisabled={!!variableType}
          createNewOption="Create new variable"
        />
      </div>
      <div className="assign-attributes-attribute__value">
        { variableType &&
          <Field
            name={`${field}.value`}
            component={ValueComponent}
            options={options}
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
