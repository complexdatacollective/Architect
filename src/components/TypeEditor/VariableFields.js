import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formValueSelector, autofill } from 'redux-form';
import { connect } from 'react-redux';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { VARIABLE_TYPES, VARIABLE_TYPES_WITH_OPTIONS } from '@app/config/variables';
import { getFieldId } from '@app/utils/issues';
import safeName from '@app/utils/safeName';
import ValidatedField from '@components/Form/ValidatedField';
import * as ArchitectFields from '@components/Form/Fields';
import { Row } from '@components/OrderedList';
import Validations from './Validations';
import Options from './Options';

const variableTypes = Object.values(VARIABLE_TYPES);

class VariableFields extends Component {
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
          <div id={getFieldId('type')} data-name="Variable type" />
          <ValidatedField
            name="type"
            className="form-field-container"
            component={ArchitectFields.NativeSelect}
            label="Variable type"
            options={variableTypes}
            validation={{ required: true }}
            onChange={resetOptions}
            placeholder="Select variable type"
          />
        </Row>
        <Row>
          { VARIABLE_TYPES_WITH_OPTIONS.includes(variableType) &&
            <Options
              name="options"
              label="Options"
              form={form}
            />
          }

          { variableType &&
            <Validations
              name="validation"
              label="Validations"
              variableType={variableType}
              form={form}
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
};

VariableFields.defaultProps = {
  form: null,
  variableType: null,
  resetOptions: null,
};

const mapStateToProps = (state, { form }) => {
  const variableType = formValueSelector(form)(state, 'type');

  return {
    variableType,
  };
};

const mapDispatchToProps = (dispatch, { form }) => ({
  autofill: (field, value) =>
    dispatch(autofill(form, field, value)),
});

export { VariableFields };

export default connect(mapStateToProps, mapDispatchToProps)(VariableFields);
