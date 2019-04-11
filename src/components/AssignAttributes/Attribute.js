import React from 'react';
import { get } from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import Icon from '../../ui/components/Icon';
import * as Fields from '../../ui/components/Fields';
import { getCodebook } from '../../selectors/codebook';
import { getComponentsForType } from '../Form/inputOptions';
import Select from '../Form/Fields/Select';

const withVariableMeta = connect(
  (state, { nodeType, form, field }) => {
    const codebook = getCodebook(state);
    const variable = formValueSelector(form)(state, `${field}.variable`);
    const type = get(codebook, ['node', nodeType, 'variables', variable, 'type']);

    return {
      type,
    };
  },
);

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
            label={null}
            fieldLabel={null}
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

export { Attribute };

export default compose(
  withVariableMeta,
)(Attribute);
