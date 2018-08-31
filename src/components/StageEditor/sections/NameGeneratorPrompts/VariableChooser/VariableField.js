import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SeamlessText from '../../../../Form/Fields/SeamlessText';
import Contexts from '../../../../Form/Fields/Contexts';
import { RadioGroup } from '../../../../../ui/components/Fields';
import Select from '../../../../Form/Fields/Select';
import ValidatedField from '../../../../Form/ValidatedField';

const getOptions = (variable) => {
  switch (variable.type) {
    case 'boolean':
      return { component: RadioGroup, options: [true, false] };
    case 'number':
      return { component: SeamlessText };
    case 'enumerable':
      return { component: Contexts, options: variable.options };
    case 'options':
      return { component: Select, options: variable.options };
    case 'text':
    default:
      return { component: SeamlessText };
  }
};

const VariableField = ({ name, className, variable }) => {
  const componentClasses = cx('form-fields-variable-chooser__variable-field', className);

  if (!variable) { return null; }

  return (
    <ValidatedField
      className={componentClasses}
      name={name}
      validation={variable.validation}
      {...getOptions(variable)}
    />
  );
};

VariableField.propTypes = {
  name: PropTypes.string.isRequired,
  variable: PropTypes.object,
  className: PropTypes.string,
};

VariableField.defaultProps = {
  variable: null,
  className: '',
};

export { VariableField };

export default VariableField;
