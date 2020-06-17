import React, { PureComponent } from 'react';
import { createFilter } from 'react-select';
import Creatable from 'react-select/creatable';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '@codaco/ui/lib/components/Icon';
import DefaultSelectOption from './DefaultSelectOption';

/**
 * Contains WIP changes to add inline delete, which is paused for now.
 */

const getValue = (options, value) => {
  const foundValue = options.find(option => option.value === value);

  if (!foundValue) { return null; }

  return foundValue;
};

class CreatableSelect extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { reservedVariable: null };
  }

  get value() {
    return getValue(this.props.options, this.props.input.value);
  }

  getOptionWithDeleteProp = WrappedComponent =>
    props => (
      <WrappedComponent
        {...props}
        onDeleteOption={this.handleDeleteOption}
      />
    );

  handleChange = (option) => {
    // We are presenting a "fake" option to show an error message,
    // if it is selected we ignore the action.
    // eslint-disable-next-line no-underscore-dangle
    if (option.__isWarning__) {
      return;
    }

    if (option && option.value) {
      this.props.input.onChange(option.value);
    } else {
      this.props.input.onChange(null);
    }
  };

  handleCreateOption = (value) => {
    const result = this.props.onCreateOption(value);
    this.props.input.onChange(result);
  }

  handleDeleteOption = (value) => {
    if (!this.props.onDeleteOption) { return; }

    this.props.onDeleteOption(value);

    // Reset input if current value
    if (value === this.props.input.value) {
      this.props.input.onChange(null);
    }
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
      reserved,
      selectOptionComponent: SelectOptionComponent,
      label,
      onCreateOption,
      meta: { invalid, error, touched },
      ...rest
    } = this.props;

    const reservedVariable = this.state.reservedVariable;

    const componentClasses = cx(
      className,
      'form-fields-select',
      {
        'form-fields-select--has-error': invalid && touched && error,
      },
    );

    const Option = this.props.onDeleteOption ?
      this.getOptionWithDeleteProp(SelectOptionComponent) :
      SelectOptionComponent;

    const reservedOption = reservedVariable ?
      [{
        label: `"${reservedVariable}" is already used elsewhere in ${rest.entity}`,
        value: null,
        __isWarning__: true,
      }] :
      [];

    const optionsWithWarnings = [
      ...options,
      ...reservedOption,
    ];

    return (
      <div className={componentClasses}>
        { label &&
          <h4>{label}</h4>
        }
        <Creatable
          className="form-fields-select"
          classNamePrefix="form-fields-select"
          {...input}
          options={optionsWithWarnings}
          filterOption={createFilter({
            ignoreCase: true,
            trim: true,
          })}
          isClearable
          isSearchable
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
          isValidNewOption={(option) => {
            // True if option contains only spaces or no chars
            const isEmpty = option.replace(/ /g, '').length === 0;

            // True if option matches the label prop of the supplied object
            const matchLabel = ({ label: variableLabel }) =>
              variableLabel && option &&
              variableLabel.toLowerCase() === option.toLowerCase();
            const alreadyExists = options.some(matchLabel);
            const isReserved = reserved.some(matchLabel);
            if (!alreadyExists && isReserved) {
              this.setState({ reservedVariable: option });
            } else {
              this.setState({ reservedVariable: null });
            }

            return !isEmpty && !alreadyExists && !isReserved;
          }}

          {...rest}
        >
          {children}
        </Creatable>
        {invalid && touched && <div className="form-fields-select__error"><Icon name="warning" />{error}</div>}
      </div>
    );
  }
}

CreatableSelect.propTypes = {
  className: PropTypes.string,
  options: PropTypes.array,
  selectOptionComponent: PropTypes.any,
  input: PropTypes.object,
  onCreateOption: PropTypes.func.isRequired,
  onDeleteOption: PropTypes.func,
  label: PropTypes.string,
  children: PropTypes.node,
  reserved: PropTypes.array,
  meta: PropTypes.object,
};

CreatableSelect.defaultProps = {
  className: '',
  selectOptionComponent: DefaultSelectOption,
  onDeleteOption: null,
  options: [],
  input: {},
  label: null,
  children: null,
  reserved: [],
  meta: { invalid: false, error: null, touched: false },
};

export default CreatableSelect;
