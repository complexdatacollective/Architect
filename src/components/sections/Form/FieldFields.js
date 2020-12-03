import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { isVariableTypeWithOptions, isVariableTypeWithParameters } from '@app/config/variables';
import { getFieldId } from '@app/utils/issues';
import ValidatedField from '@components/Form/ValidatedField';
import NativeSelect from '@components/Form/Fields/NativeSelect';
import VariableSelect from '@components/Form/Fields/VariableSelect';
import Options from '@components/Options';
import Parameters from '@components/Parameters';
import Validations from '@components/Validations';
import { Section, Row } from '@components/EditorLayout';
import withFieldsHandlers from './withFieldsHandlers';
import Tip from '../../Tip';
import ExternalLink from '../../ExternalLink';
import InputPreview from '../../Form/Fields/InputPreview';

const PromptFields = ({
  form,
  variable,
  variableType,
  variableOptions,
  componentOptions,
  component,
  isNewVariable,
  metaForType,
  handleNewVariable,
  handleChangeComponent,
  handleChangeVariable,
  entity,
  type,
}) => (
  <React.Fragment>
    <Section>
      <Row>
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
          component={VariableSelect}
          entity={entity}
          type={type}
          options={variableOptions} // from variables
          onCreateOption={handleNewVariable} // reset later fields, create variable of no type?
          onChange={handleChangeVariable} // read/reset component options validation
          validation={{ required: true }}
        />
      </Row>
    </Section>
    <Section>
      <Row>
        <h3 id={getFieldId('prompt')}>Question prompt</h3>
        <p>Enter question for the participant. e.g. What is this person&apos;s name?</p>
        <ValidatedField
          name="prompt"
          component={Fields.Text}
          placeholder="What is this person's name?"
          validation={{ required: true }}
        />
      </Row>
    </Section>
    { variable &&
      <Section>
        <Row>
          <h3 id={getFieldId('component')}>Input control</h3>
          <p>
            Choose an input control that should be used to collect the answer. For
            detailed information about these options, see our <ExternalLink href="https://documentation.networkcanvas.com/docs/key-concepts/input-controls/">documentation</ExternalLink>.
          </p>
          <ValidatedField
            name="component"
            component={NativeSelect}
            placeholder="Select an input control"
            options={componentOptions}
            validation={{ required: true }}
            onChange={handleChangeComponent}
          />
          { isNewVariable && variableType &&
            <Tip>
              <p>
                The selected input control will cause this variable to be defined as
                type <strong>{variableType}</strong>. Once set, this cannot be changed
                (although you may change the input control within this type).
              </p>
            </Tip>
          }
          { !isNewVariable && variableType &&
            <Tip type="warning">
              <div>
                <p>
                  A pre-existing variable is currently selected. You cannot change a variable
                  type after it has been created, so only <strong>{variableType}</strong> compatible
                  input control can be selected above. If you would like to use a different
                  input control type, you will need to create a new variable.
                </p>
              </div>
            </Tip>
          }
        </Row>
        { variableType &&
        <Row>
          <h4>Preview</h4>
          <InputPreview {...metaForType} />
        </Row>
        }
      </Section>
    }
    { isVariableTypeWithOptions(variableType) &&
      <Section>
        <Row>
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
      </Section>
    }
    { isVariableTypeWithParameters(variableType) &&
      <Section>
        <Row>
          <h3 id={getFieldId('parameters')}>Input Options</h3>
          <Parameters
            type={variableType}
            component={component}
            name="parameters"
            form={form}
          />
        </Row>
      </Section>
    }
    { variableType &&
      <Section>
        <Row>
          <h3 id={getFieldId('validation')}>Validation</h3>
          <p>
            Add one or more validation rules to require that participants complete
            this field in a specific way.
          </p>
          <Validations
            form={form}
            name="validation"
            variableType={variableType}
          />
        </Row>
      </Section>
    }
  </React.Fragment>
);

PromptFields.propTypes = {
  form: PropTypes.string.isRequired,
  variable: PropTypes.string,
  component: PropTypes.string,
  variableType: PropTypes.string,
  handleChangeComponent: PropTypes.func.isRequired,
  metaForType: PropTypes.object.isRequired,
  variableOptions: PropTypes.array,
  componentOptions: PropTypes.array,
  isNewVariable: PropTypes.bool.isRequired,
  handleNewVariable: PropTypes.func.isRequired,
  handleChangeVariable: PropTypes.func.isRequired,
  entity: PropTypes.string,
  type: PropTypes.string,
};

PromptFields.defaultProps = {
  variable: null,
  component: null,
  variableType: null,
  variableOptions: null,
  componentOptions: null,
  entity: null,
  type: null,
};

export { PromptFields };

export default compose(
  withFieldsHandlers,
)(PromptFields);
