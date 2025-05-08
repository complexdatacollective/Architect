import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { change, formValueSelector } from 'redux-form';
import { Section, Row } from '@components/EditorLayout';
import Validations from '@components/Validations';

const AnonymisationValidation = ({
  form,
}) => {
  const dispatch = useDispatch();
  const getFormValue = formValueSelector(form);
  const hasValidation = useSelector((state) => {
    const validation = getFormValue(state, 'validation');
    return validation && Object.keys(validation).length > 0;
  });

  const handleToggleValidation = (nextState) => {
    if (nextState === false) {
      dispatch(change(form, 'validation', null));
    }

    return true;
  };

  return (
    <Section
      toggleable
      title="Passphrase Validation"
      summary={(
        <p>
          Add one or more validation rules for the passphrase.
        </p>
      )}
      startExpanded={!!hasValidation}
      handleToggleChange={handleToggleValidation}
    >
      <Row>
        <Validations
          form={form}
          name="validation"
          variableType="passphrase"
        />
      </Row>
    </Section>
  );
};

AnonymisationValidation.propTypes = {
  form: PropTypes.string.isRequired,
};

export default AnonymisationValidation;
