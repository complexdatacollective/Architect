import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { getFieldId } from '../../../utils/issues';
import { ValidatedField } from '../../Form';
import TextArea from '../../../ui/components/Fields/TextArea';
import CreatableSelect from '../../Form/Fields/CreatableSelect';
import ColorPicker from '../../Form/Fields/ColorPicker';
import MultiSelect from '../../Form/MultiSelect';
import Section from '../Section';
import Row from '../Row';
import NewVariableWindow from '../../NewVariableWindow';
import { getSortOrderOptionGetter } from '../CategoricalBinPrompts/optionGetters';
import withPromptProps from '../CategoricalBinPrompts/withPromptProps';
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
  const ordinalVariableOptions = variableOptions
    .filter(({ type: variableType }) => variableType === 'ordinal');

  return (
    <Section>
      <Row>
        <h3 id={getFieldId('text')}>Text for Prompt</h3>
        <ValidatedField
          name="text"
          component={TextArea}
          label=""
          placeholder="Enter text for the prompt here"
          validation={{ required: true }}
        />
      </Row>
      <Row>
        <h3 id={getFieldId('variable')}>Ordinal variable</h3>
        <ValidatedField
          name="variable"
          component={CreatableSelect}
          label=""
          options={ordinalVariableOptions}
          onCreateOption={openNewVariableWindow}
          onDeleteOption={handleDeleteVariable}
          validation={{ required: true }}
        />
      </Row>
      <Row>
        <div id={getFieldId('color')} data-name="Gradient color" />
        <p>What color would you like to use for the gradient?</p>
        <ValidatedField
          component={ColorPicker}
          name="color"
          palette="ord-color-seq"
          paletteRange={8}
          validation={{ required: true }}
        />
      </Row>
      <Row>
        <h3>Bin Sort Order</h3>
        <p>How would you like to sort the node categories?</p>
        <MultiSelect
          name="binSortOrder"
          properties={[
            { fieldName: 'property' },
            { fieldName: 'direction' },
          ]}
          options={getSortOrderOptionGetter(variableOptions)}
        />
      </Row>
      <Row>
        <h3>Bucket Sort Order</h3>
        <p>How would you like to sort the unplaced nodes?</p>
        <MultiSelect
          name="bucketSortOrder"
          properties={[
            { fieldName: 'property' },
            { fieldName: 'direction' },
          ]}
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
};

export { PromptFields };

export default compose(
  withNewVariableWindowHandlers,
  withPromptProps,
)(PromptFields);
