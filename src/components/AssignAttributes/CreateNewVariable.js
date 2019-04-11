import React from 'react';
import { getFieldId } from '../../utils/issues';
import * as Fields from '../../ui/components/Fields';
import ValidatedField from '../Form/ValidatedField';
import Select from '../Form/Fields/Select';
import { isVariableTypeWithOptions, variableOptions } from '../Form/inputOptions';
import Options from '../Options';
import { Row } from '../OrderedList';
import FormWindow from '../FormWindow';
import withCreateNewVariableState, { form } from './withCreateNewVariableState';

console.log({ variableOptions });

const CreateNewVariable = ({
  show,
  variableTypeOptions,
  variableType,
  onSubmit,
  onCancel,
}) => (
  <FormWindow
    show={show}
    form={form}
    onSubmit={onSubmit}
    onCancel={onCancel}
  >
    <Row>
      <h3 id={getFieldId('name')}>Variable name</h3>
      <p>Enter a name for this variable which will be used to export data</p>
      <ValidatedField
        name="name"
        component={Fields.Text}
        placeholder="e.g. Name"
      />
    </Row>
    <Row>
      <h3 id={getFieldId('type')}>Variable type</h3>
      <p>Choose a variable type</p>
      <ValidatedField
        name="type"
        component={Select}
        placeholder="Select variable type"
        options={variableOptions}
      />
    </Row>
    { isVariableTypeWithOptions(variableType) &&
      <Row>
        <h3 id={getFieldId('options')}>Options</h3>
        <p>Create some options for this input control</p>
        <Options
          name="options"
          label="Options"
          meta={{ form }}
        />
      </Row>
    }
  </FormWindow>
);

export { CreateNewVariable };

export default withCreateNewVariableState(CreateNewVariable);
