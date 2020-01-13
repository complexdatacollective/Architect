import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { getFieldId } from '@app/utils/issues';
import { Text, Toggle } from '@codaco/ui/lib/components/Fields';
import DetachedField from '@components/DetachedField';
import { ValidatedField } from '@components/Form';
import CreatableSelect from '@components/Form/Fields/CreatableSelect';
import MultiSelect from '@components/Form/MultiSelect';
import NewVariableWindow from '@components/NewVariableWindow';
import Options from '@components/Options';
import Row from '@components/sections/Row';
import Section from '@components/sections/Section';
import withNewVariableWindowHandlers, {
  propTypes as newWindowVariablePropTypes,
} from '@components/enhancers/withNewVariableWindowHandlers';
import { getSortOrderOptionGetter } from './optionGetters';
import withPromptProps from './withPromptProps';
import Tip from '../../Tip';

const PromptFields = ({
  variableOptions,
  handleCreateNewVariable,
  handleDeleteVariable,
  normalizeKeyDown,
  entity,
  type,
  variable,
  openNewVariableWindow,
  closeNewVariableWindow,
  newVariableName,
  showNewVariableWindow,
}) => {
  const [otherVariableToggle, setOtherVariableToggle] = useState(false);

  const categoricalVariableOptions = variableOptions
    .filter(({ type: variableType }) => variableType === 'categorical');

  const sortMaxItems = getSortOrderOptionGetter(variableOptions)('property').length;

  const clickToggleOtherVariable = () =>
    setOtherVariableToggle(!otherVariableToggle);

  return (
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
          component={Text}
          label=""
          placeholder="Enter text for the prompt here..."
          validation={{ required: true, maxLength: 220 }}
        />
      </Row>
      <Row>
        <h3 id={getFieldId('variable')}>Categorical Variable</h3>
        <ValidatedField
          name="variable"
          component={CreatableSelect}
          label=""
          options={categoricalVariableOptions}
          onCreateOption={openNewVariableWindow}
          onDeleteOption={handleDeleteVariable}
          onKeyDown={normalizeKeyDown}
          validation={{ required: true }}
          formatCreateLabel={inputValue => (
            <span>
              Click here to create a new categorical variable named &quot;{inputValue}&quot;.
            </span>
          )}
        />
      </Row>
      <Row>
        { variable &&
          <Section>
            <h3 id={getFieldId('options')}>Variable Options</h3>
            <p>Create some options for this variable</p>
            <Options
              name="variableOptions"
              label="Options"
            />
          </Section>
        }
      </Row>
      { variable &&
        <Row>
          <h3 id={getFieldId('toggleOtherVariable')}>&quot;Other&quot; variable</h3>
          <p>Optional free-text field for participant options</p>
          <DetachedField
            component={Toggle}
            name="toggleOtherVariable"
            value={otherVariableToggle}
            onChange={clickToggleOtherVariable}
          />
        </Row>
      }
      { otherVariableToggle &&
        <Row>
          <ValidatedField
            name="otherVariable"
            component={CreatableSelect}
            label="Other Variable"
            options={categoricalVariableOptions}
            onCreateOption={openNewVariableWindow}
            onDeleteOption={handleDeleteVariable}
            onKeyDown={normalizeKeyDown}
            validation={{ required: true }}
            formatCreateLabel={inputValue => (
              <span>
                Click here to create an other option named &quot;{inputValue}&quot;.
              </span>
            )}
          />
          <ValidatedField
            name="otherVariableLabel"
            component={Text}
            label="Other variable label"
            placeholder="Text to describe the other field"
            validation={{ required: true, maxLength: 220 }}
          />
        </Row>
      }
      <Row>
        <h3>Bucket Sort Order <small>(optional)</small></h3>
        <p>
          Nodes are stacked in the bucket before they are placed by the participant. You may
          optionally configure a list of rules to determine how nodes are sorted in the bucket
          when the task starts, which will determine the order that your participant places them
          into bins. Network Canvas will default to using the order in which nodes were named.
        </p>
        <Tip>
          <p>
            Use the asterisk property to sort by the order that nodes were created.
          </p>
        </Tip>
        <MultiSelect
          name={'bucketSortOrder'}
          properties={[
            { fieldName: 'property' },
            { fieldName: 'direction' },
          ]}
          maxItems={sortMaxItems}
          options={getSortOrderOptionGetter(variableOptions)}
        />
      </Row>
      <Row>
        <h3>Bin Sort Order <small>(optional)</small></h3>
        <p>
          You may also configure one or more sort rules that determine the order that nodes
          are listed after they have been placed into a bin.
        </p>
        <MultiSelect
          name={'binSortOrder'}
          properties={[
            { fieldName: 'property' },
            { fieldName: 'direction' },
          ]}
          maxItems={sortMaxItems}
          options={getSortOrderOptionGetter(variableOptions)}
        />
      </Row>

      <NewVariableWindow
        initialValues={{
          type: 'categorical',
          name: newVariableName,
        }}
        show={showNewVariableWindow}
        entity={entity}
        type={type}
        onComplete={handleCreateNewVariable}
        onCancel={closeNewVariableWindow}
      />
    </Section>
  );
};

PromptFields.propTypes = {
  variableOptions: PropTypes.array,
  handleDeleteVariable: PropTypes.func.isRequired,
  handleCreateNewVariable: PropTypes.func.isRequired,
  entity: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  ...newWindowVariablePropTypes,
};

PromptFields.defaultProps = {
  variableOptions: [],
  categoricalVariableOptions: [],
};

export { PromptFields };

export default compose(
  withNewVariableWindowHandlers,
  withPromptProps,
)(PromptFields);
