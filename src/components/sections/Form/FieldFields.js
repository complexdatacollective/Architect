import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { omit } from 'lodash';
import { Field as RichText } from '@codaco/ui/lib/components/Fields/RichText';
import { isOrdinalOrCategoricalType, isVariableTypeWithParameters, isBooleanWithOptions } from '@app/config/variables';
import ValidatedField from '@components/Form/ValidatedField';
import NativeSelect from '@components/Form/Fields/NativeSelect';
import Options from '@components/Options';
import Parameters from '@components/Parameters';
import { Section, Row } from '@components/EditorLayout';
import withFieldsHandlers from './withFieldsHandlers';
import Tip from '../../Tip';
import ExternalLink from '../../ExternalLink';
import InputPreview from '../../Form/Fields/InputPreview';
import BooleanChoice from '../../BooleanChoice';
import VariablePicker from '../../Form/Fields/VariablePicker/VariablePicker';
import ValidationSection from '../ValidationSection';

const PromptFields = ({
  form,
  variable,
  existingVariables,
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
  <>
    <Section title="Variable">
      <Row>
        {variable && !isNewVariable
          && (
            <Tip>
              <p>
                When selecting an existing variable, changes you make to the input control or
                validation options will also change other uses of this variable.
              </p>
            </Tip>
          )}
        <ValidatedField
          name="variable"
          component={VariablePicker}
          variable={variable}
          entity={entity}
          type={type}
          options={variableOptions} // from variables
          onCreateOption={handleNewVariable} // reset later fields, create variable of no type?
          onChange={handleChangeVariable} // read/reset component options validation
          validation={{ required: true }}
          issueDescription="variable"
        />
      </Row>
    </Section>
    <Section
      title="Question Prompt"
      summary={(
        <p>Enter question for the participant. e.g. What is this person&apos;s name?</p>
      )}
    >
      <Row>
        <ValidatedField
          name="prompt"
          component={RichText}
          inline
          placeholder="What is this person's name?"
          validation={{ required: true }}
          issueDescription="prompt"
        />
      </Row>
    </Section>
    <Section
      disabled={!variable}
      title="Input Control"
      summary={(
        <p>
          Choose an input control that should be used to collect the answer. For
          detailed information about these options, see our
          {' '}
          <ExternalLink href="https://documentation.networkcanvas.com/key-concepts/input-controls/">documentation</ExternalLink>
          .
        </p>
      )}
    >
      <Row>
        <ValidatedField
          name="component"
          component={NativeSelect}
          placeholder="Select an input control"
          options={componentOptions}
          validation={{ required: true }}
          onChange={handleChangeComponent}
          sortOptionsByLabel={!isNewVariable}
          issueDescription="component"
        />
        {isNewVariable && variableType
          && (
            <Tip>
              <p>
                The selected input control will cause this variable to be defined as
                type
                {' '}
                <strong>{variableType}</strong>
                . Once set, this cannot be changed
                (although you may change the input control within this type).
              </p>
            </Tip>
          )}
        {!isNewVariable && variableType
          && (
            <Tip type="warning">
              <div>
                <p>
                  A pre-existing variable is currently selected. You cannot change a variable
                  type after it has been created, so only
                  {' '}
                  <strong>{variableType}</strong>
                  {' '}
                  compatible
                  input controls can be selected above. If you would like to use a different
                  input control type, you will need to create a new variable.
                </p>
              </div>
            </Tip>
          )}
      </Row>
      {variableType
        && (
          <Row>
            <h4>Preview</h4>
            <InputPreview
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...metaForType}
            />
          </Row>
        )}
    </Section>
    {isOrdinalOrCategoricalType(variableType)
      && (
        <Section
          id="options"
          title="Categorical/Ordinal options"
          summary={(
            <p>
              The input type you selected indicates that this is a categorical or ordinal variable.
              Next, please create a minimum of two possible values for the participant to choose
              between.
            </p>
          )}
        >
          <Row>
            <Options
              name="options"
              label="Options"
              form={form}
            />
          </Row>
        </Section>
      )}
    {isBooleanWithOptions(component)
      && (
        <Section id="parameters" title="BooleanChoice Options">
          <Row>
            <BooleanChoice form={form} />
          </Row>
        </Section>
      )}
    {isVariableTypeWithParameters(variableType)
      && (
        <Section title="Input Options" id="parameters">
          <Row>
            <Parameters
              type={variableType}
              component={component}
              name="parameters"
              form={form}
            />
          </Row>
        </Section>
      )}
    <ValidationSection
      form={form}
      disabled={!variableType}
      entity={entity}
      variableType={variableType}
      existingVariables={omit(existingVariables, variable)}
    />
  </>
);

PromptFields.propTypes = {
  form: PropTypes.string.isRequired,
  variable: PropTypes.string,
  existingVariables: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
  component: PropTypes.string,
  variableType: PropTypes.string,
  handleChangeComponent: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  metaForType: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  variableOptions: PropTypes.array,
  // eslint-disable-next-line react/forbid-prop-types
  componentOptions: PropTypes.array,
  isNewVariable: PropTypes.bool.isRequired,
  handleNewVariable: PropTypes.func.isRequired,
  handleChangeVariable: PropTypes.func.isRequired,
  entity: PropTypes.string,
  type: PropTypes.string,
};

PromptFields.defaultProps = {
  variable: null,
  existingVariables: null,
  component: null,
  variableType: null,
  variableOptions: null,
  metaForType: {},
  componentOptions: null,
  entity: null,
  type: null,
};

export { PromptFields };

export default compose(
  withFieldsHandlers,
)(PromptFields);
