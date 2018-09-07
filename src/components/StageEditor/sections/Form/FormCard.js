import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const FormCard = ({ label, input: { checked, onChange, value } }) => (
  <div
    className={cx(
      'stage-editor-section-form__card',
      { 'stage-editor-section-form__card--selected': checked },
      { 'stage-editor-section-form__card--empty': !value },
    )}
    onClick={onChange}
  >
    {label}
    {!value && 'No form'}
  </div>
);

FormCard.propTypes = {
  label: PropTypes.string,
  input: PropTypes.shape({
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any,
  }).isRequired,
};

FormCard.defaultProps = {
  label: null,
};

export default FormCard;
