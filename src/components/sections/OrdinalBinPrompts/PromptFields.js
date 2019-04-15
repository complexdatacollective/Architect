import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { getFieldId } from '../../../utils/issues';
import { ValidatedField } from '../../Form';
import TextArea from '../../../ui/components/Fields/TextArea';
import CreatableSelect from '../../Form/Fields/CreatableSelect';
import ColorPicker from '../../Form/Fields/ColorPicker';
import MultiSelect from '../../Form/MultiSelect';
import Row from '../Row';

import NewVariableWindow from '../../NewVariableWindow';
import withVariableOptions from '../CategoricalBinPrompts/withVariableOptions';
import withVariableHandlers from '../CategoricalBinPrompts/withVariableHandlers';
import { getSortOrderOptionGetter } from '../CategoricalBinPrompts/optionGetters';

const PromptFields = ({
  variableOptions,
  setCreateNewVariable,
  handleCancelNewVariable,
  handleCreateNewVariable,
  handleDeleteVariable,
  createNewVariable,
  entity,
  type,
}) => {
  const ordinalVariableOptions = variableOptions
    .filter(({ type: variableType }) => variableType === 'ordinal');

  return (
    <React.Fragment>
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
          onCreateOption={variableName => setCreateNewVariable(variableName)}
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
          name: createNewVariable,
        }}
        show={createNewVariable !== null}
        entity={entity}
        type={type}
        onComplete={handleCreateNewVariable}
        onCancel={handleCancelNewVariable}
      />
    </React.Fragment>
  );
};

PromptFields.propTypes = {
  variableOptions: PropTypes.array,
  setCreateNewVariable: PropTypes.func.isRequired,
  handleCancelNewVariable: PropTypes.func.isRequired,
  handleDeleteVariable: PropTypes.func.isRequired,
  handleCreateNewVariable: PropTypes.func.isRequired,
  createNewVariable: PropTypes.string.isRequired,
  entity: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

PromptFields.defaultProps = {
  variableOptions: [],
};

export { PromptFields };

export default compose(
  withVariableOptions,
  withVariableHandlers,
)(PromptFields);
