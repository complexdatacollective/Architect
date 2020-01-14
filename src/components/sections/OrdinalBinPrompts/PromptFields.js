import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import Text from '@codaco/ui/lib/components/Fields/Text';
import { getFieldId } from '../../../utils/issues';
import { ValidatedField } from '../../Form';
import CreatableSelect from '../../Form/Fields/CreatableSelect';
import ColorPicker from '../../Form/Fields/ColorPicker';
import MultiSelect from '../../Form/MultiSelect';
import Section from '../Section';
import Row from '../Row';
import NewVariableWindow from '../../NewVariableWindow';
import Options from '../../Options';
import { getSortOrderOptionGetter } from '../CategoricalBinPrompts/optionGetters';
import withVariableOptions from '../CategoricalBinPrompts/withVariableOptions';
import withNewVariableHandlers from '../CategoricalBinPrompts/withNewVariableHandlers';
import withNewVariableWindowHandlers, {
  propTypes as newWindowVariablePropTypes,
} from '../../enhancers/withNewVariableWindowHandlers';
import Tip from '../../Tip';

const PromptFields = ({
  variableOptions,
  handleCreateNewVariableForVariable,
  normalizeKeyDown,
  handleDeleteVariable,
  entity,
  type,
  variable,
  openNewVariableWindow,
  closeNewVariableWindow,
  newVariableName,
  showNewVariableWindow,
}) => {
  const ordinalVariableOptions = variableOptions
    .filter(({ type: variableType }) => variableType === 'ordinal');

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
        <h3 id={getFieldId('variable')}>Ordinal Variable</h3>
        <p>
          Select an existing ordinal variable from the list below, or create a new one
          by typing a name into the box and pressing enter.
        </p>
        <ValidatedField
          name="variable"
          component={CreatableSelect}
          label=""
          options={ordinalVariableOptions}
          onCreateOption={openNewVariableWindow}
          onDeleteOption={handleDeleteVariable}
          onKeyDown={normalizeKeyDown}
          validation={{ required: true }}
          formatCreateLabel={inputValue => (
            <span>
              Click here to create a new ordinal variable named &quot;{inputValue}&quot;.
            </span>
          )}
        />
      </Row>
      <Row>
        { variable &&
          <Section>
            <h3 id={getFieldId('variableOptions')}>Variable Options</h3>
            <p>Create some options for this variable</p>
            <Options
              name="variableOptions"
              label="Options"
            />
          </Section>
        }
      </Row>
      <Row>
        <h3 id={getFieldId('color')} data-name="Gradient color">Color</h3>
        <p>
          Network Canvas will render each option in your ordinal variable using a
          color gradient. Which color would you like to use for this scale?
        </p>
        <Tip>
          <p>Consider using a color consistently throughout your interview protocol
          to represent each theme, to help reenforce the idea to your participants.
          </p>
        </Tip>
        <ValidatedField
          component={ColorPicker}
          name="color"
          palette="ord-color-seq"
          paletteRange={8}
          validation={{ required: true }}
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
      <Row>
        <h3>Bin Sort Order <small>(optional)</small></h3>
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


      <NewVariableWindow
        initialValues={{
          type: 'ordinal',
          name: newVariableName,
        }}
        show={showNewVariableWindow}
        entity={entity}
        type={type}
        onComplete={handleCreateNewVariableForVariable}
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
};

PromptFields.defaultProps = {
  variableOptions: [],
};

export { PromptFields };

export default compose(
  withNewVariableWindowHandlers,
  withVariableOptions,
  withNewVariableHandlers('variable'),
)(PromptFields);
