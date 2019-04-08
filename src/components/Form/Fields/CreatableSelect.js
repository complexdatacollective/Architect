import React, { PureComponent } from 'react';
import { components as ReactSelectComponents } from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '../../../ui/components/Icon';

/**
 * Contains WIP changes to add inline delete, which is paused for now.
 */

const getValue = (options, value) => {
  const foundValue = options.find(option => option.value === value);

  if (!foundValue) { return null; }

  return foundValue;
};

/* eslint-disable */
const DefaultSelectItem = (props) => {
  // const isNew = !!props.data.__isNew__;

  return (
    <ReactSelectComponents.Option
      {...props}
      className="form-fields-select__item"
      classNamePrefix="form-fields-select__item"
    >
      <div className="form-fields-select__item-label">
        {props.data.label}
        {/* { !isNew &&
          <div
            className="form-fields-select__item-delete"
            onClick={() => props.onDeleteOption(props.data.value)}
          >
            <Icon name="delete" />
          </div>
        } */}
      </div>
    </ReactSelectComponents.Option>
  );
};
/* eslint-enable */

class Select extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.array,
    selectOptionComponent: PropTypes.any,
    input: PropTypes.object,
    onCreateOption: PropTypes.func.isRequired,
    onDeleteOption: PropTypes.func.isRequired,
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

  handleCreateOption = (value) => {
    const result = this.props.onCreateOption(value);
    this.props.input.onChange(result);
  }

  handleDeleteOption = (value) => {
    this.props.onDeleteOption(value);
    // TODO: If current value, reset?
  };

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
      selectOptionComponent: SelectOptionComponent,
      label,
      onCreateOption,
      meta: { invalid, error, touched },
      ...rest
    } = this.props;

    const componentClasses = cx(
      className,
      'form-fields-select',
      {
        'form-fields-select--has-error': invalid && touched && error,
      },
    );

    const Option = props => (
      <SelectOptionComponent
        {...props}
        onDeleteOption={this.handleDeleteOption}
      />
    );

    return (
      <div className={componentClasses}>
        { label &&
          <h4>{label}</h4>
        }
        <CreatableSelect
          className="form-fields-select"
          classNamePrefix="form-fields-select"
          {...input}
          options={options}
          value={this.value}
          components={{ Option }}
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          menuPortalTarget={document.body}
          onChange={this.handleChange}
          onCreateOption={this.handleCreateOption}
          // CreatableSelect has unusual onBlur that doesn't play nicely with redux-forms
          // https://github.com/erikras/redux-form/issues/82#issuecomment-386108205
          // Sending the old value on blur, and disabling blurInputOnSelect work in
          // a round about way, and still allow us to use the `touched` property.
          onBlur={this.handleBlur}
          blurInputOnSelect={false}
          giveThisToOption={() => false}
          {...rest}
        >
          {children}
        </CreatableSelect>
        {invalid && touched && <div className="form-fields-select__error"><Icon name="warning" />{error}</div>}
      </div>
    );
  }
}

export default Select;
