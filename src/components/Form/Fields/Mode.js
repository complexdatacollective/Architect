import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { asOptionObject, getValue } from '../../../ui/components/Fields/utils/options';

class Mode extends PureComponent {
  static propTypes = {
    options: PropTypes.array,
    label: PropTypes.string,
    meta: PropTypes.object,
    className: PropTypes.string,
    input: PropTypes.object.isRequired,
  };

  static defaultProps = {
    className: null,
    label: null,
    meta: { invalid: false, error: null, touched: false },
    options: [],
    disabled: false,
  };

  handleClickMode = index =>
    this.props.input.onChange(getValue(this.props.options[index]));

  isModeSelected = option =>
    this.props.input.value === option;

  renderMode = (option, index) => {
    const { input: { value } } = this.props;
    const { value: optionValue, label: optionLabel, ...optionRest } = asOptionObject(option);
    const selected = optionValue === value;
    const disabled = optionRest.disabled || false;

    const optionClasses = cx(
      'form-fields-mode__option',
      { 'form-fields-mode__option--selected': selected },
      { 'form-fields-mode__option--disabled': disabled },
    );

    return (
      <div
        className={optionClasses}
        onClick={disabled ? null : () => this.handleClickMode(index)}
        key={optionValue}
        {...optionRest}
      >
        {optionLabel}
      </div>
    );
  }

  render() {
    const {
      options,
      className,
      label,
      meta: { touched, invalid, error },
    } = this.props;

    const classNames = cx(
      'form-field-container',
      'form-fields-mode',
      className,
      {
        'form-fields-mode--has-error': touched && invalid,
      },
    );

    return (
      <div className={classNames}>
        { label &&
          <h4 className="form-fields-mode__label">{label}</h4>
        }
        <div className="form-fields-mode__options">
          { options.map(this.renderMode) }
        </div>
        { touched && invalid && <p className="form-fields-mode__error">{error}</p> }
      </div>
    );
  }
}

export default Mode;
