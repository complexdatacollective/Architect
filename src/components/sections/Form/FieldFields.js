import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { isVariableTypeWithOptions, isVariableTypeWithParameters } from '@app/config/variables';
import { getFieldId } from '@app/utils/issues';
import ValidatedField from '@components/Form/ValidatedField';
import Select from '@components/Form/Fields/Select';
import CreatableSelect from '@components/Form/Fields/CreatableSelect';
import Options from '@components/Options';
import Parameters from '@components/Parameters';
import Validations from '@components/Validations';
import SelectOptionImage from '@components/Form/Fields/SelectOptionImage';
import { normalizeKeyDown } from '@components/enhancers/withCreateVariableHandler';
import Row from '../Row';
import Section from '../Section';
import withFieldsHandlers from './withFieldsHandlers';
import Tip from '../../Tip';

const PromptFields = ({
  form,
  variable,
  variableType,
  variableOptions,
  componentOptions,
  component,
  isNewVariable,
  handleNewVariable,
  handleChangeComponent,
  handleChangeVariable,
}) => (
  <Section>
    <Row contentId="guidance.section.form.field.name">
      <h3 id={getFieldId('variable')}>Variable</h3>
      <p>
        Create a variable below, or choose from existing variables in the drop-down list.
      </p>
      { variable && !isNewVariable &&
        <Tip>
          <p>
            When selecting an existing variable, changes you make to the input control or
            validation options will also change other uses of this variable.
          </p>
        </Tip>
      }
      <ValidatedField
        name="variable"
        component={CreatableSelect}
        options={variableOptions} // from variables
        onCreateOption={handleNewVariable} // reset later fields, create variable of no type?
        onChange={handleChangeVariable} // read/reset component options validation
        onKeyDown={normalizeKeyDown}
        validation={{ required: true }}
        placeholder="Type to create a variable..."
        formatCreateLabel={inputValue => (
          <span>
            Click here to create a variable named &quot;{inputValue}&quot;.
          </span>
        )}
      />
    </Row>
    <Row contentId="guidance.section.form.field.prompt">
      <h3 id={getFieldId('prompt')}>Question prompt</h3>
      <p>Enter question for the particpant. e.g. What is this person&apos;s name?</p>
      <ValidatedField
        name="prompt"
        component={Fields.Text}
        placeholder="What is this person's name?"
        validation={{ required: true }}
      />
    </Row>
    { variable &&
      <Row contentId="guidance.section.form.field.component">
        <h3 id={getFieldId('component')}>Input control</h3>
        <p>Choose an input control that should be used to collect the answer.</p>
        <ValidatedField
          name="component"
          component={Select}
          placeholder="Select component"
          options={componentOptions}
          selectOptionComponent={SelectOptionImage}
          validation={{ required: true }}
          onChange={handleChangeComponent}
        />
        { isNewVariable && variableType &&
          <Tip>
            <p>
              The selected input component will cause this variable to be defined as
              type <strong>{variableType}</strong>. Once set, this cannot be changed
              (although you may change the input component within this type).
            </p>
          </Tip>
        }
        { !isNewVariable && variableType &&
          <Tip type="warning">
            <div>
              <p>
                A pre-existing variable is currently selected. You cannot change a variable
                type after it has been created, so only <strong>{variableType}</strong> compatible
                input components can be selected above. If you would like to use a different
                component type, you will need to create a new variable.
              </p>
            </div>
          </Tip>
        }

      </Row>
    }
    { isVariableTypeWithOptions(variableType) &&
      <Row contentId="guidance.section.form.field.Options">
        <h3 id={getFieldId('options')}>Categorical/Ordinal options</h3>
        <p>
          The input type you selected indicates that this is a categorical or ordinal variable.
          Next, please create a minimum of two possible values for the participant to choose
          between.
        </p>
        <Options
          name="options"
          label="Options"
          form={form}
        />
      </Row>
    }
    { isVariableTypeWithParameters(variableType) &&
      <Row contentId="guidance.section.form.field.Parameters">
        <h3 id={getFieldId('parameters')}>Input Options</h3>
        <Parameters
          type={variableType}
          component={component}
          name="parameters"
        />
      </Row>
    }
    { variableType &&
      <Row contentId="guidance.section.form.field.validation">
        <h3 id={getFieldId('validation')}>Validation</h3>
        <p>Select any input requirements that you would like to enforce.</p>
        <Validations
          form={form}
          name="validation"
          variableType={variableType}
        />
      </Row>
    }
  </Section>
);

PromptFields.propTypes = {
  form: PropTypes.string.isRequired,
  variable: PropTypes.string,
  component: PropTypes.string,
  variableType: PropTypes.string,
  handleChangeComponent: PropTypes.func.isRequired,
  variableOptions: PropTypes.array,
  componentOptions: PropTypes.array,
  isNewVariable: PropTypes.bool.isRequired,
  handleNewVariable: PropTypes.func.isRequired,
  handleChangeVariable: PropTypes.func.isRequired,
};

PromptFields.defaultProps = {
  variable: null,
  component: null,
  variableType: null,
  variableOptions: null,
  componentOptions: null,
};

export { PromptFields };

export default compose(
  withFieldsHandlers,
)(PromptFields);
