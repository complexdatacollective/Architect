import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field, formValueSelector, getFormMeta, autofill } from 'redux-form';
import { connect } from 'react-redux';
import { get } from 'lodash';
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

// Both form types (type editor and variable editor) use different formats for this prop
const getFormName = form => form.name || form;

const mapStateToProps = (state, { form, fieldId }) => {
  const field = fieldId ? `${fieldId}.type` : 'type'; // This is used by two different forms
  const formName = getFormName(form);
  const formMeta = getFormMeta(formName)(state);
  const nameTouched = get(formMeta, 'name.touched', false);
  const variableType = formValueSelector(formName)(state, field);

  return {
    nameTouched,
    variableType,
  };
};

const mapDispatchToProps = (dispatch, { form }) => {
  const formName = getFormName(form);

  return {
    autofill: (field, value) => dispatch(autofill(formName, field, value)),
  };
};

export { VariableFields };

export default connect(mapStateToProps, mapDispatchToProps)(VariableFields);
