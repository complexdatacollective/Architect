import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Field } from 'redux-form';
import Icon from '../../ui/components/Icon';
import * as Fields from '../../ui/components/Fields';
import { getComponentsForType } from '../Form/inputOptions';
import Select from '../Form/Fields/Select';
import withAttributeState from './withAttributeState';

const getInputComponentForType = (type) => {
  const components = getComponentsForType(type);
  const componentName = get(components, [0, 'value']); // Use the first possible option
  return Fields[componentName];
};

const Attribute = ({
  field,
  fields,
  index,
  type,
  options,
  onCreateNew,
  variableOptions,
}) => {
  const ValueComponent = type && getInputComponentForType(type);

  return (
    <div className="assign-attributes-attribute">
      <div className="assign-attributes-attribute__variable">
        <Field
          name={`${field}.variable`}
          component={Select}
          options={variableOptions}
          onCreateNew={() => { onCreateNew(index); }}
          createNewOption
        />
      </div>
      <div className="assign-attributes-attribute__value">
        { type &&
          <Field
            name={`${field}.value`}
            component={ValueComponent}
            options={options}
          />
        }
      </div>
      <div
        className="assign-attributes-attribute__delete"
        onClick={() => fields.remove(index)}
      >
        <Icon name="delete" />
      </div>
    </div>
  );
};

Attribute.propTypes = {
  field: PropTypes.string.isRequired,
  fields: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  type: PropTypes.string,
  options: PropTypes.array,
  onCreateNew: PropTypes.func.isRequired,
  variableOptions: PropTypes.array.isRequired,
};

Attribute.defaultProps = {
  type: null,
  options: [],
};

export { Attribute };

export default withAttributeState(Attribute);
