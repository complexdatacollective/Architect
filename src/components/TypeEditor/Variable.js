import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Field,
  isDirty as isFieldDirty,
  isInvalid as isFieldInvalid,
  hasSubmitFailed as reduxHasSubmitFailed,
  FormSection,
  change,
  formValueSelector,
  getFormMeta,
  autofill,
} from 'redux-form';
import { get } from 'lodash';
import Guidance from '../Guidance';
import { ValidatedField } from '../Form';
import * as Fields from '../../ui/components/Fields';
import * as ArchitectFields from '../Form/Fields';
import Validations from './Validations';
import Options from './Options';
import ExpandableItem from '../Items/ExpandableItem';
import { getFieldId } from '../../utils/issues';
import safeName from './safeName';

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

class Variable extends Component {
  handleChangeLabel = (e, value) => {
    if (this.props.nameTouched) { return; }
    this.props.autofill('name', safeName(value));
  }

  handleNormalizeName = value => safeName(value);

  render() {
    const {
      fieldId,
      isDirty,
      isInvalid,
      hasSubmitFailed,
      form,
      variableType,
      resetOptions,
      ...rest
    } = this.props;

    return (
      <ExpandableItem
        open={isDirty}
        lockOpen={isInvalid && hasSubmitFailed}
        preview={(
          <FormSection name={fieldId}>
            <h3 className="variable__preview-title">
              <Field
                name="name"
                component={({ input: { value } }) => value || 'undefined'}
              />
              &nbsp;:&nbsp;
              <em>
                <Field
                  name="type"
                  component={({ input: { value } }) => value || 'undefined'}
                />
              </em>
            </h3>
            <p className="variable__preview-description">
              <Field
                name="description"
                component={({ input: { value } }) => value}
              />
            </p>
          </FormSection>
        )}
        {...rest}
      >
        <FormSection name={fieldId}>
          <Guidance contentId="guidance.registry.type.variable">
            <div>
              <div id={getFieldId(`${fieldId}.label`)} data-name="Variable label" />
              <ValidatedField
                name="label"
                component={Fields.Text}
                label="Label"
                onChange={this.handleChangeLabel}
                validation={{ required: true }}
              />
              <div id={getFieldId(`${fieldId}.name`)} data-name="Variable name" />
              <ValidatedField
                name="name"
                component={Fields.Text}
                label="Name"
                normalize={this.handleNormalizeName}
                validation={{ required: true }}
              />
              <Field
                name="description"
                component={Fields.Text}
                label="Description"
              />
              <div id={getFieldId(`${fieldId}.type`)} data-name="Variable type" />
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
            </div>
          </Guidance>
        </FormSection>
      </ExpandableItem>
    );
  }
}

Variable.propTypes = {
  fieldId: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired,
  isDirty: PropTypes.bool,
  resetOptions: PropTypes.func.isRequired,
  variableType: PropTypes.string,
  isInvalid: PropTypes.bool.isRequired,
  hasSubmitFailed: PropTypes.bool.isRequired,
};

Variable.defaultProps = {
  isDirty: false,
  variableType: null,
};

const mapStateToProps = (state, { form, fieldId }) => {
  const formMeta = getFormMeta(form)(state);

  return {
    nameTouched: get(formMeta, `${fieldId}.name.touched`, false),
    isDirty: isFieldDirty(form)(state, fieldId),
    isInvalid: isFieldInvalid(form)(state, fieldId),
    hasSubmitFailed: reduxHasSubmitFailed(form)(state),
    variableType: formValueSelector(form)(state, `${fieldId}.type`),
  };
};

const mapDispatchToProps = (dispatch, { form, fieldId }) => ({
  autofill: (field, value) => dispatch(autofill(form, `${fieldId}.name`, value)),
  resetOptions: () => {
    dispatch(change(form, `${fieldId}.options`, null));
    dispatch(change(form, `${fieldId}.validation`, []));
  },
});

export { Variable };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Variable);
