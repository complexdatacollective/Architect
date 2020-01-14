import React, { useState, useEffect } from 'react';
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
import Tip from '@components/Tip';
import withNewVariableWindowHandlers from '@components/enhancers/withNewVariableWindowHandlers';
import { useStack } from '@components/Stack';
import { getSortOrderOptionGetter } from './optionGetters';
import withVariableOptions from './withVariableOptions';
import withNewVariableHandlers from './withNewVariableHandlers';

const useToggle = (initialState) => {
  const [value, setValue] = useState(initialState);

  const toggleValue = () =>
    setValue(!value);

  return [value, toggleValue, setValue];
};

const PromptFields = ({
  variableOptions,
  form,
  changeForm,
  handleCreateNewVariableForVariable,
  handleCreateNewVariableForOtherVariable,
  handleDeleteVariableForVariable,
  handleDeleteVariableForOtherVarible,
  normalizeKeyDown,
  entity,
  type,
  variable,
}) => {
  const [otherVariableToggle, clickToggleOtherVariable] = useToggle(false);

  const [newVariable, setNewVariable] = useState({ type: null, name: null });

  const closeWindow = () => {
    setNewVariable({ type: null, name: null });
  };

  const handleCreateNewVariable = (variableId) => {
    const field = newVariable.type === 'categorical' ? 'variable' : 'otherVariable';
    changeForm(form, field, variableId);
    closeWindow();
  };

  const [updateNewVariableWindow] = useStack(
    NewVariableWindow, {
      initialValues: {},
      show: false,
      entity,
      type,
      onComplete: handleCreateNewVariable,
      onCancel: closeWindow,
    },
  );

  useEffect(() => {
    // updateNewVariableWindow({
    //   initialValues: newVariable,
    //   show: !newVariable.name,
    // });
  }, [newVariable.type, newVariable.name]);

  const handleEditNewCategoricalVariable = (name) => {
    setNewVariable({ type: 'categorical', name });
  };

  const handleEditNewTextVariable = (name) => {
    setNewVariable({ type: 'text', name });
  };

  const categoricalVariableOptions = variableOptions
    .filter(({ type: variableType }) => variableType === 'categorical');

  const otherVariableOptions = variableOptions
    .filter(({ type: variableType }) => variableType === 'text');

  const sortMaxItems = getSortOrderOptionGetter(variableOptions)('property').length;

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
          onCreateOption={handleEditNewCategoricalVariable}
          onDeleteOption={handleDeleteVariableForVariable}
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
            options={otherVariableOptions}
            onCreateOption={handleEditNewTextVariable}
            onDeleteOption={handleDeleteVariableForOtherVarible}
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
            placeholder="Text to describe the &quot;other&quot; field"
            validation={{ required: true }}
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
    </Section>
  );
};

PromptFields.propTypes = {
  entity: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  variable: PropTypes.string,
  variableOptions: PropTypes.array,
};

PromptFields.defaultProps = {
  variable: null,
  variableOptions: [],
};

export { PromptFields };

export default compose(
  withNewVariableWindowHandlers,
  withVariableOptions,
  withNewVariableHandlers('variable'),
  withNewVariableHandlers('otherVariable'),
)(PromptFields);
