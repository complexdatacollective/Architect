import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SeamlessText from '../SeamlessText';
import Contexts from '../Contexts';
import RadioGroup from '../RadioGroup';
import Select from '../Select';
import ValidatedField from '../../ValidatedField';

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

class VariableField extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    variable: PropTypes.object,
    className: PropTypes.string,
  };

  static defaultProps = {
    variable: null,
    className: '',
  };

  render() {
    const { name, className, variable } = this.props;
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
  }
}

export { VariableField };

export default VariableField;
