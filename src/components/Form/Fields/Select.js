import React, { PureComponent } from 'react';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '@codaco/ui/lib/components/Icon';
import DefaultSelectOption from './DefaultSelectOption';

const getValue = (options, value) => {
  const foundValue = options.find(option => option.value === value);
  if (!foundValue) { return null; }

  return foundValue;
};

class Select extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.array,
    selectOptionComponent: PropTypes.any,
    onDeleteOption: PropTypes.func,
    input: PropTypes.object,
    label: PropTypes.string,
    children: PropTypes.node,
    meta: PropTypes.object,
  };

  static defaultProps = {
    className: '',
    selectOptionComponent: DefaultSelectOption,
    onDeleteOption: null,
    options: [],
    input: {},
    label: null,
    children: null,
    meta: { invalid: false, error: null, touched: false },
  };

  get value() {
    return getValue(this.props.options, this.props.input.value);
  }

  handleChange = (option) => {
    /* eslint-disable no-underscore-dangle */
    if (option.__createNewOption__) {
      this.props.onCreateNew();
      return;
    }
    /* eslint-enable */
    this.props.input.onChange(option.value);
  }

  handleBlur = () => {
    if (!this.props.input.onBlur) { return; }
    this.props.input.onBlur(this.props.input.value);
  }

  render() {
    const {
      className,
      input: { onBlur, ...input },
      options,
      children,
      selectOptionComponent,
      label,
      createNewOption,
      meta: { invalid, error, touched },
      ...rest
    } = this.props;

    const optionsWithNew = createNewOption ?
      [...this.props.options, { __createNewOption__: createNewOption }] :
      this.props.options;

    const componentClasses = cx(
      className,
      'form-fields-select',
      {
        'form-fields-select--has-error': invalid && touched && error,
      },
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
          options={optionsWithNew}
          value={this.value}
          components={{ Option: selectOptionComponent }}
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
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
        {invalid && touched && <div className="form-fields-select__error"><Icon name="warning" />{error}</div>}
      </div>
    );
  }
}

export default Select;
