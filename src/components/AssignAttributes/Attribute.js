import React from 'react';
import { get, first } from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import Icon from '../../ui/components/Icon';
import * as Fields from '../../ui/components/Fields';
import { getCodebook } from '../../selectors/codebook';
import { getComponentsForType } from '../Form/inputOptions';
import Select from '../Form/Fields/CreatableSelect';

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
  const componentName = first(getComponentsForType(type)).value;
  return Fields[componentName];
};

const Attribute = ({
  field,
  fields,
  index,
  type,
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
        />
      </div>
      <div className="assign-attributes-attribute__value">
        { type &&
          <Field
            name={`${field}.value`}
            component={ValueComponent}
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
