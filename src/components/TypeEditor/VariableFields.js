import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import ValidatedField from '../Form/ValidatedField';
import * as Fields from '../../ui/components/Fields';
import * as ArchitectFields from '../Form/Fields';
import Validations from './Validations';
import Options from './Options';
import { getFieldId } from '../../utils/issues';
import safeName from './safeName';
import { Row } from '../OrderedList';

const VARIABLE_TYPES = [
  'text',
  'number',
  'datetime',
  'boolean',
  'ordinal',
  'categorical',
  'layout',
  'location',
];

const VARIABLE_TYPES_WITH_OPTIONS = [
  'ordinal',
  'categorical',
];

class VariableFields extends PureComponent {
  handleChangeLabel = (e, value) => {
    if (this.props.nameTouched) { return; }
    this.props.autofill('name', safeName(value));
  }

  handleNormalizeName = value => safeName(value);

  render() {
    const {
      form,
      variableType,
      resetOptions,
    } = this.props;

    return (
      <React.Fragment>
        <Row>
          <div id={getFieldId('label')} data-name="Variable label" />
          <ValidatedField
            name="label"
            component={Fields.Text}
            label="Label"
            onChange={this.handleChangeLabel}
            validation={{ required: true }}
          />
        </Row>
        <Row>
          <div id={getFieldId('name')} data-name="Variable name" />
          <ValidatedField
            name="name"
            component={Fields.Text}
            label="Name"
            normalize={this.handleNormalizeName}
            validation={{ required: true }}
          />
        </Row>
        <Row>
          <Field
            name="description"
            component={Fields.Text}
            label="Description"
          />
        </Row>
        <Row>
          <div id={getFieldId('type')} data-name="Variable type" />
          <ValidatedField
            name="type"
            className="form-field-container"
            component={ArchitectFields.Select}
            label="Variable type"
            options={VARIABLE_TYPES.map(variable => (
              { value: variable, label: variable }
            ))}
            validation={{ required: true }}
            onChange={resetOptions}
            placeHolder="&mdash; Select variable type &mdash;"
          />
        </Row>
        <Row>
          { VARIABLE_TYPES_WITH_OPTIONS.includes(variableType) &&
            <Options
              name="options"
              label="Options"
              meta={{ form }}
            />
          }

          { variableType &&
            <Validations
              name="validation"
              label="Validations"
              variableType={variableType}
              meta={{ form }}
            />
          }
        </Row>
      </React.Fragment>
    );
  }
}

VariableFields.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  variableType: PropTypes.string,
  resetOptions: PropTypes.func,
  autofill: PropTypes.func,
  nameTouched: PropTypes.bool,
};

VariableFields.defaultProps = {
  form: null,
  variableType: null,
  resetOptions: null,
  autofill: () => {},
  nameTouched: () => {},
};

const withVariableType = connect((state, { form, fieldId }) => {
  const field = fieldId ? `${fieldId}.type` : 'type'; // This is used by two different forms
  const formName = form.name || form; // Both forms use different formats for this prop.
  const variableType = formValueSelector(formName)(state, field);

  return {
    variableType,
  };
});

export { VariableFields };

export default withVariableType(VariableFields);
