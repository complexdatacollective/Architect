import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { change, formValueSelector } from 'redux-form';
import { get, pickBy } from 'lodash';
import { Section, Row } from '@components/EditorLayout';
import Validations from '@components/Validations';
import { getFieldId } from '../../utils/issues';

const ValidationSection = ({
  disabled,
  form,
  variableType,
  existingVariables,
}) => {
  const dispatch = useDispatch();
  const getFormValue = formValueSelector(form);
  const hasValidation = useSelector((state) => getFormValue(state, 'validation'));

  const handleToggleValidation = (nextState) => {
    if (nextState === false) {
      dispatch(change(form, 'validation', null));
    }

    return true;
  };

  const existingVariablesForType = pickBy(existingVariables, (variable) => get(variable, 'type') === variableType);
  return (
    <Section
      disabled={disabled}
      id={getFieldId('validation')}
      toggleable
      title="Validation"
      summary={(
        <p>
          Add one or more validation rules to this form field.
        </p>
      )}
      startExpanded={!!hasValidation}
      handleToggleChange={handleToggleValidation}
    >
      <Row>
        <Validations
          form={form}
          name="validation"
          variableType={variableType}
          existingVariables={existingVariablesForType}
        />
      </Row>
    </Section>
  );
};

ValidationSection.propTypes = {
  disabled: PropTypes.bool,
  form: PropTypes.string.isRequired,
  variableType: PropTypes.string,
  existingVariables: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

ValidationSection.defaultProps = {
  variableType: '',
  disabled: false,
};

export default ValidationSection;
