import React from 'react';
import PropTypes from 'prop-types';
import { fieldPropTypes } from 'redux-form';
import { last, toPath } from 'lodash';
import cx from 'classnames';
import RoundButton from '../../RoundButton';

const Tag = ({
  editVariable,
  deleteVariable,
  meta: { invalid },
  input: { name: fieldName, value: fieldValue },
}) => {
  const variableName = last(toPath(fieldName));
  const variant = fieldName.length % 4;
  const tagClasses = cx(
    'form-fields-variable-chooser__variable',
    {
      'form-fields-variable-chooser__variable--has-error': invalid,
      [`form-fields-variable-chooser__variable--variant-${variant}`]: true,
    },
  );
  const displayValue = JSON.stringify(fieldValue);

  return (
    <div
      key={fieldName}
      className={tagClasses}
    >
      <span onClick={() => editVariable(variableName)}>
        <strong>{variableName}</strong>: <em>{displayValue}</em>
      </span>
      <RoundButton size="small" onClick={() => deleteVariable(variableName)} icon="X" />
    </div>
  );
};

Tag.propTypes = {
  editVariable: PropTypes.func.isRequired,
  deleteVariable: PropTypes.func.isRequired,
  ...fieldPropTypes,
};

export default Tag;
