import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form';
import { withHandlers, compose } from 'recompose';
import { getFieldId } from '../../../utils/issues';
import { ValidatedField } from '../../Form';
import * as Fields from '../../../ui/components/Fields';
import Select from '../../Form/Fields/Select';
import Options from '../../Options';
import Validations from '../../Validations';
import { Row } from '../../OrderedList';
import Guidance from '../../Guidance';
import SelectOptionImage from '../../Form/Fields/SelectOptionImage';
import inputOptions, { getTypeForComponent, isVariableTypeWithOptions } from './inputOptions';

const mapStateToProps = (state, { form }) => ({
  variableType: getTypeForComponent(
    formValueSelector(form)(state, 'component'),
  ),
});

const mapDispatchToProps = {
  changeField: change,
};

const handlers = {
  handleChangeComponent: ({ changeField, form }) =>
    () => changeField(form, 'validation', {}),
};

const PromptFields = ({ form, variableType, handleChangeComponent }) => (
  <React.Fragment>
    <Guidance contentId="guidance.section.form.field.name">
      <Row>
        <h3 id={getFieldId('name')}>Variable name</h3>
        <p>Enter a name for this variable which will be used to export data</p>
        <ValidatedField
          name="name"
          component={Fields.Text}
          placeholder="e.g. Name"
          validation={{ required: true }}
          // safename
        />
      </Row>
    </Guidance>
    <Guidance contentId="guidance.section.form.field.prompt">
      <Row>
        <h3 id={getFieldId('prompt')}>Prompt</h3>
        <p>Enter question for the particpant. e.g. What is this person&apos;s name?</p>
        <ValidatedField
          name="prompt"
          component={Fields.Text}
          placeholder="What is this person's name?"
          validation={{ required: true }}
        />
      </Row>
    </Guidance>
    <Guidance contentId="guidance.section.form.field.component">
      <Row>
        <h3 id={getFieldId('component')}>Input control</h3>
        <p>Choose a control to collect the answer</p>
        <ValidatedField
          name="component"
          component={Select}
          placeholder="Select component"
          options={inputOptions}
          selectOptionComponent={SelectOptionImage}
          validation={{ required: true }}
          onChange={handleChangeComponent}
        />
      </Row>
    </Guidance>
    { isVariableTypeWithOptions(variableType) &&
      <Guidance contentId="guidance.section.form.field.Options">
        <Row>
          <h3 id={getFieldId('options')}>Options</h3>
          <p>Create some options for this input control</p>
          <Options
            name="options"
            label="Options"
            meta={{ form }}
          />
        </Row>
      </Guidance>
    }
    { variableType &&
      <Guidance contentId="guidance.section.form.field.validation">
        <Row>
          <h3 id={getFieldId('validation')}>Validation</h3>
          <p>Select any input requirements that you would like to enforce</p>
          <Validations
            form={form}
            name="validation"
            variableType={variableType}
          />
        </Row>
      </Guidance>
    }
  </React.Fragment>
);

PromptFields.propTypes = {
  form: PropTypes.string.isRequired,
  variableType: PropTypes.string.isRequired,
  handleChangeComponent: PropTypes.func.isRequired,
};

export { PromptFields };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(handlers),
)(PromptFields);
