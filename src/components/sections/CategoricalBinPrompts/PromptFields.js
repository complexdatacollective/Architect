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

  return (
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
        <ValidatedField
          name={'variable'}
          component={CreatableSelect}
          label=""
          options={categoricalVariableOptions}
          onCreateOption={openNewVariableWindow}
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
          name: newVariableName,
        }}
        show={showNewVariableWindow}
        entity={entity}
        type={type}
        onComplete={handleCreateNewVariable}
        onCancel={closeNewVariableWindow}
      />
    </React.Fragment>
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
