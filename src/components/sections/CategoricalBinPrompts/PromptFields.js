import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { getFieldId } from '../../../utils/issues';
import { ValidatedField } from '../../Form';
import CreatableSelect from '../../Form/Fields/CreatableSelect';
import { TextArea } from '../../../ui/components/Fields';
import MultiSelect from '../../Form/MultiSelect';
import Row from '../Row';
import NewVariableWindow from '../../NewVariableWindow';
import { getSortOrderOptionGetter } from './optionGetters';
import withVariableOptions from './withVariableOptions';
import withVariableHandlers from './withVariableHandlers';

const PromptFields = ({
  variableOptions,
  categoricalVariableOptions,
  setCreateNewVariable,
  handleCancelNewVariable,
  handleCreateNewVariable,
  handleDeleteVariable,
  createNewVariable,
  entity,
  type,
}) => (
  <React.Fragment>
    <Row>
      <h3 id={getFieldId('text')}>Text for Prompt</h3>
      <ValidatedField
        name={'text'}
        component={TextArea}
        label=""
        placeholder="Enter text for the prompt here"
        validation={{ required: true }}
      />
    </Row>
    <Row>
      <h3 id={getFieldId('variable')}>Categorical variable</h3>
      {console.log(handleDeleteVariable)}
      <ValidatedField
        name={'variable'}
        component={CreatableSelect}
        label=""
        options={categoricalVariableOptions}
        onCreateOption={variableName => setCreateNewVariable(variableName)}
        onDeleteOption={handleDeleteVariable}
        validation={{ required: true }}
      />
    </Row>
    <Row>
      <h3>Bin Sort Order</h3>
      <p>How would you like to sort the node categories?</p>
      <MultiSelect
        name={'binSortOrder'}
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
        name={'bucketSortOrder'}
        properties={[
          { fieldName: 'property' },
          { fieldName: 'direction' },
        ]}
        options={getSortOrderOptionGetter(variableOptions)}
      />
    </Row>

    <NewVariableWindow
      initialValues={{
        type: 'categorical',
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

PromptFields.propTypes = {
  variableOptions: PropTypes.array,
  categoricalVariableOptions: PropTypes.array,
  setCreateNewVariable: PropTypes.func.isRequired,
  handleCancelNewVariable: PropTypes.func.isRequired,
  handleCreateNewVariable: PropTypes.func.isRequired,
  createNewVariable: PropTypes.string.isRequired,
  entity: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

PromptFields.defaultProps = {
  variableOptions: [],
  categoricalVariableOptions: [],
};

export { PromptFields };

export default compose(
  withVariableOptions,
  withVariableHandlers,
)(PromptFields);
