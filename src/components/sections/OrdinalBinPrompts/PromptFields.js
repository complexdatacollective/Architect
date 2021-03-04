import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Field as RichTextField, MODES } from '@components/RichText';
import { getFieldId } from '@app/utils/issues';
import { ValidatedField } from '@components/Form';
import VariableSelect from '@components/Form/Fields/VariableSelect';
import ColorPicker from '@components/Form/Fields/ColorPicker';
import MultiSelect from '@components/Form/MultiSelect';
import { Section, Row } from '@components/EditorLayout';
import NewVariableWindow, { useNewVariableWindowState } from '@components/NewVariableWindow';
import Options from '@components/Options';
import Tip from '@components/Tip';
import { getSortOrderOptionGetter } from '@components/sections/CategoricalBinPrompts/optionGetters';
import withVariableOptions from '@components/sections/CategoricalBinPrompts/withVariableOptions';
import withVariableHandlers from '@components/sections/CategoricalBinPrompts/withVariableHandlers';

const PromptFields = ({
  changeForm,
  entity,
  form,
  type,
  variable,
  variableOptions,
  optionsForVariableDraft,
}) => {
  const newVariableWindowInitialProps = {
    entity,
    type,
    initialValues: { name: null, type: null },
  };

  const handleCreatedNewVariable = (id, { field }) => changeForm(form, field, id);

  const [newVariableWindowProps, openNewVariableWindow] = useNewVariableWindowState(
    newVariableWindowInitialProps,
    handleCreatedNewVariable,
  );

  const handleNewVariable = (name) => openNewVariableWindow({ initialValues: { name, type: 'ordinal' } }, { field: 'variable' });

  const ordinalVariableOptions = variableOptions
    .filter(({ type: variableType }) => variableType === 'ordinal');

  const sortMaxItems = getSortOrderOptionGetter(variableOptions)('property').length;

  const totalOptionsLength = (optionsForVariableDraft && optionsForVariableDraft.length);

  const showVariableOptionsTip = totalOptionsLength > 5;

  return (
    <>
      <Section>
        <Row>
          <h3 id={getFieldId('text')}>Prompt Text</h3>
          <p>
            The prompt text instructs your participant about the task on this stage.
            Enter the text to use for your prompt below.
          </p>
          <Tip>
            <p>
              You can use markdown formatting in this prompt to create bold or underlined text.
            </p>
          </Tip>
          <ValidatedField
            name="text"
            component={RichTextField}
            mode={MODES.single}
            label=""
            placeholder="Enter text for the prompt here..."
            validation={{ required: true, maxLength: 220 }}
          />
        </Row>
      </Section>
      <Section>
        <Row>
          <h3 id={getFieldId('variable')}>Ordinal Variable</h3>
          <ValidatedField
            name="variable"
            component={VariableSelect}
            entity={entity}
            type={type}
            label=""
            options={ordinalVariableOptions}
            onCreateOption={handleNewVariable}
            validation={{ required: true }}
          />
        </Row>
      </Section>
      { variable
        && (
        <Section>
          <Row>
            <h3 id={getFieldId('variableOptions')}>Variable Options</h3>
            <p>
              Create
              <strong>up to 5</strong>
              {' '}
              options for this variable.
            </p>
            { showVariableOptionsTip
            && (
            <Tip type="error">
              <p>
                The ordinal bin interface is designed to use
                {' '}
                <strong>
                  up to 5 option
                  values
                  {' '}
                </strong>
                . Using more will create
                a sub-optimal experience for participants, and might reduce data quality.
              </p>
            </Tip>
            )}
            <Options
              name="variableOptions"
              label="Options"
            />
          </Row>
        </Section>
        )}
      <Section>
        <Row>
          <h3 id={getFieldId('color')} data-name="Gradient color">Color</h3>
          <p>
            Interviewer will render each option in your ordinal variable using a
            color gradient. Which color would you like to use for this scale?
          </p>
          {/* <Tip>
            <p>
              Consider using a color consistently throughout your interview protocol
              to represent each theme, to help reenforce the idea to your participants.
            </p>
          </Tip> */}
          <ValidatedField
            component={ColorPicker}
            name="color"
            palette="ord-color-seq"
            paletteRange={8}
            validation={{ required: true }}
          />
        </Row>
      </Section>
      <Section>
        <Row>
          <h3>
            Bucket Sort Order
            <small>(optional)</small>
          </h3>
          <p>
            Nodes are stacked in the bucket before they are placed by the participant. You may
            optionally configure a list of rules to determine how nodes are sorted in the bucket
            when the task starts, which will determine the order that your participant places them
            into bins. Interviewer will default to using the order in which nodes were named.
          </p>
          <Tip>
            <p>
              Use the asterisk property to sort by the order that nodes were created.
            </p>
          </Tip>
          <MultiSelect
            name="bucketSortOrder"
            properties={[
              { fieldName: 'property' },
              { fieldName: 'direction' },
            ]}
            maxItems={sortMaxItems}
            options={getSortOrderOptionGetter(variableOptions)}
          />
        </Row>
      </Section>
      <Section>
        <Row>
          <h3>
            Bin Sort Order
            <small>(optional)</small>
          </h3>
          <p>
            You may also configure one or more sort rules that determine the order that nodes
            are listed after they have been placed into a bin.
          </p>
          <MultiSelect
            name="binSortOrder"
            properties={[
              { fieldName: 'property' },
              { fieldName: 'direction' },
            ]}
            maxItems={sortMaxItems}
            options={getSortOrderOptionGetter(variableOptions)}
          />
        </Row>
      </Section>
      <NewVariableWindow {...newVariableWindowProps} />
    </>
  );
};

PromptFields.propTypes = {
  variableOptions: PropTypes.array,
  entity: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  changeForm: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  variable: PropTypes.string,
  optionsForVariableDraft: PropTypes.array,
};

PromptFields.defaultProps = {
  variableOptions: [],
  variable: null,
  optionsForVariableDraft: [],
};

export { PromptFields };

export default compose(
  withVariableOptions,
  withVariableHandlers,
)(PromptFields);
