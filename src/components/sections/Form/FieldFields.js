import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { getFieldId } from '../../../utils/issues';
import { ValidatedField } from '../../Form';
import * as Fields from '../../../ui/components/Fields';
import Select from '../../Form/Fields/Select';
import CreatableSelect from '../../Form/Fields/CreatableSelect';
import Options from '../../Options';
import Validations from '../../Validations';
import SelectOptionImage from '../../Form/Fields/SelectOptionImage';
import inputOptions, { isVariableTypeWithOptions } from '../../Form/inputOptions';
import Row from '../Row';
import Section from '../Section';
import withFieldsMeta from './withFieldsHandlers';

class PromptFields extends Component {
  handleChangeComponent = () => {
    this.props.resetFields({
      options: null,
      validation: {},
    });
  }

  render() {
    const {
      form,
      variableType,
      variableOptions,
      createNewVariable,
      handleChangeVariable,
    } = this.props;

    return (
      <Section>
        <Row contentId="guidance.section.form.field.name">
          <h3 id={getFieldId('variable')}>Variable</h3>
          <p>
            Choose or create a variable.
          </p>
          <ValidatedField
            name="variable"
            component={CreatableSelect}
            options={variableOptions} // from variables
            onCreateOption={createNewVariable} // reset later fields, create variable of no type?
            onChange={handleChangeVariable} // read/reset component options validation
            validation={{ required: true }}
          />
        </Row>
        <Row contentId="guidance.section.form.field.prompt">
          <h3 id={getFieldId('prompt')}>Question prompt</h3>
          <p>Enter question for the particpant. e.g. What is this person&apos;s name?</p>
          <ValidatedField
            name="prompt"
            component={Fields.Text}
            placeholder="What is this person's name?"
            validation={{ required: true }}
          />
        </Row>
        <Row contentId="guidance.section.form.field.component">
          <h3 id={getFieldId('component')}>Input control</h3>
          <p>Choose an input control that should be used to collect the answer.</p>
          <ValidatedField
            name="component"
            component={Select}
            placeholder="Select component"
            options={inputOptions}
            selectOptionComponent={SelectOptionImage}
            validation={{ required: true }}
            onChange={this.handleChangeComponent}
          />
        </Row>
        { isVariableTypeWithOptions(variableType) &&
          <Row contentId="guidance.section.form.field.Options">
            <h3 id={getFieldId('options')}>Categorical/Ordinal options</h3>
            <p>
              The input type you selected indicates that this is a categorical or ordinal variable.
              Next, please create a minimum of two possible values for the participant to choose
              between.
            </p>
            <Options
              name="options"
              label="Options"
              form={form}
            />
          </Row>
        }
        { variableType &&
          <Row contentId="guidance.section.form.field.validation">
            <h3 id={getFieldId('validation')}>Validation</h3>
            <p>Select any input requirements that you would like to enforce.</p>
            <Validations
              form={form}
              name="validation"
              variableType={variableType}
            />
          </Row>
        }
      </Section>
    );
  }
}

PromptFields.propTypes = {
  form: PropTypes.string.isRequired,
  variableType: PropTypes.string,
  resetFields: PropTypes.func.isRequired,
  variableOptions: PropTypes.array,
  createNewVariable: PropTypes.func.isRequired,
  handleChangeVariable: PropTypes.func.isRequired,
};

PromptFields.defaultProps = {
  variableType: null,
  variableOptions: null,
};

export { PromptFields };

export default compose(
  withFieldsMeta,
)(PromptFields);
