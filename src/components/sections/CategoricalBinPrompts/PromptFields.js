import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { getFieldId } from '../../../utils/issues';
import { ValidatedField } from '../../Form';
import CreatableSelect from '../../Form/Fields/CreatableSelect';
import { Text } from '../../../ui/components/Fields';
import MultiSelect from '../../Form/MultiSelect';
import Row from '../Row';
import Section from '../Section';
import NewVariableWindow from '../../NewVariableWindow';
import { getSortOrderOptionGetter } from './optionGetters';
import withPromptProps from './withPromptProps';
import withNewVariableWindowHandlers, {
  propTypes as newWindowVariablePropTypes,
} from '../../enhancers/withNewVariableWindowHandlers';

const PromptFields = ({
  variableOptions,
  handleCreateNewVariable,
  handleDeleteVariable,
  entity,
  type,
  openNewVariableWindow,
  closeNewVariableWindow,
  newVariableName,
  showNewVariableWindow,
}) => {
  const categoricalVariableOptions = variableOptions
    .filter(({ type: variableType }) => variableType === 'categorical');

  const sortMaxItems = getSortOrderOptionGetter(variableOptions)('property').length;

  return (
    <Section>
      <Row>
        <h3 id={getFieldId('text')}>Prompt Text</h3>
        <p>
          The prompt text instructs your participant about the task on this stage.
          Enter the text to use for your prompt below.
        </p>
        <p><strong>
          Tip: You can use markdown formatting in this prompt to create bold or underlined text.
        </strong></p>
        <ValidatedField
          name={'text'}
          component={Text}
          label=""
          placeholder="Enter text for the prompt here"
          validation={{ required: true, maxLength: 220 }}
        />
      </Row>
      <Row>
        <h3 id={getFieldId('variable')}>Categorical Variable</h3>
        <ValidatedField
          name={'variable'}
          component={CreatableSelect}
          label=""
          options={categoricalVariableOptions}
          onCreateOption={openNewVariableWindow}
          onDeleteOption={handleDeleteVariable}
          validation={{ required: true }}
          formatCreateLabel={inputValue => (
            <span>
              Press enter to create a new categorical variable named &quot;{inputValue}&quot;.
            </span>
          )}
        />
      </Row>
      <Row>
        <h3>Bucket Sort Order <small>(optional)</small></h3>
        <p>
          Nodes are stacked in the bucket before they are placed by the participant. You may
          optionally configure a list of rules to determine how nodes are sorted in the bucket
          when the task starts, which will determine the order that your participant places them
          into bins. Network Canvas will default to using the order in which nodes were named.
        </p>
        <p><strong>
          Tip: Use the asterisk property to sort by the order that nodes were created.
        </strong></p>
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
  handleCreateNewVariable: PropTypes.func.isRequired,
  handleDeleteVariable: PropTypes.func.isRequired,
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
