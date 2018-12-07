import React, { PureComponent } from 'react';
import ReactSelect, { components as ReactSelectComponents } from 'react-select';
import PropTypes from 'prop-types';
import cx from 'classnames';

const { Option } = ReactSelectComponents;

const getValue = (options, value) => {
  const foundValue = options.find(option => option.value === value);

  if (!foundValue) { return null; }

  return foundValue;
};

const DefaultSelectItem = props => (
  <Option
    {...props}
    className="form-fields-select__item"
    classNamePrefix="form-fields-select__item"
  >
    <p>{props.data.label}</p>
  </Option>
);

class Select extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.array,
    selectOptionComponent: PropTypes.any,
    input: PropTypes.object,
    label: PropTypes.string,
    children: PropTypes.node,
    meta: PropTypes.object,
  };

  static defaultProps = {
    className: '',
    selectOptionComponent: DefaultSelectItem,
    options: [],
    input: {},
    label: null,
    children: null,
    meta: { invalid: false, error: null, touched: false },
  };

  get value() {
    return getValue(this.props.options, this.props.input.value);
  }

  handleChange = option =>
    this.props.input.onChange(option.value);

  handleBlur = () => {
    if (!this.props.input.onBlur) { return; }
    this.props.input.onBlur(this.props.input.value);
  }

  render() {
    const {
      className,

      input: { onBlur, ...input },
      children,
      options,
      selectOptionComponent,
      label,
      meta: { invalid, error, touched },
      ...rest
    } = this.props;

    const componentClasses = cx(
      'form-fields-select',
      className,
    );

    return (
      <div className={componentClasses}>
        { label &&
          <h4>{label}</h4>
        }
        <ReactSelect
          className="form-fields-select"
          classNamePrefix="form-fields-select"
          {...input}
          options={options}
          value={this.value}
          components={{ Option: selectOptionComponent }}
          styles={{ menuPortal: base => ({ ...base, zIndex: 30 }) }}
          menuPortalTarget={document.body}
          onChange={this.handleChange}
          // ReactSelect has unusual onBlur that doesn't play nicely with redux-forms
          // https://github.com/erikras/redux-form/issues/82#issuecomment-386108205
          // Sending the old value on blur, and disabling blurInputOnSelect work in
          // a round about way, and still allow us to use the `touched` property.
          onBlur={this.handleBlur}
          blurInputOnSelect={false}
          {...rest}
        >
          {children}
        </ReactSelect>
        {touched && invalid && <p className="form-fields-select__error">{error}</p>}
      </div>
    );
  }
}

export default Select;
