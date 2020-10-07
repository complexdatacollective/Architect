import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '@codaco/ui/lib/components/Icon';

const getValue = (options, value) => {
  const foundValue = options.find(option => option.value === value);
  if (!foundValue) { return null; }

  return foundValue;
};

class Select extends PureComponent {
  get value() {
    return getValue(this.props.options, this.props.input.value);
  }

  handleChange = (option) => {
    /* eslint-enable */
    this.props.input.onChange(option.target.value);
  }

  render() {
    const {
      label,
      options,
      placeholder,
      className,
      input: { onBlur, ...input },
      meta: { invalid, error, touched },
      ...rest
    } = this.props;

    const componentClasses = cx(
      className,
      'form-fields-select-native__wrapper',
      {
        'form-fields-select-native__wrapper--has-error': invalid && touched && error,
      },
    );

    const selectedValue = input.value || 'placeholder';

    return (
      <div className={componentClasses}>
        { label &&
          <h4>{label}</h4>
        }
        <select
          className="form-fields-select-native"
          {...input}
          value={selectedValue}
          onChange={this.handleChange}
          {...rest}
        >
          <option disabled value="placeholder">{placeholder}</option>
          { options.map((option, index) => (
            <option
              key={index}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        {invalid && touched && <div className="form-fields-select-native__error"><Icon name="warning" />{error}</div>}
      </div>
    );
  }
}

Select.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object,
};

Select.defaultProps = {
  className: '',
  placeholder: '-- Select an option --',
  options: [],
  input: { value: '' },
  label: null,
  meta: { invalid: false, error: null, touched: false },
};


export default Select;
