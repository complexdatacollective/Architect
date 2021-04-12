import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { asOptionObject, getValue } from '@codaco/ui/lib/components/Fields/utils/options';

class Mode extends PureComponent {
  handleClickMode = (index) => {
    const {
      input,
      options,
    } = this.props;
    return input.onChange(getValue(options[index]));
  }

  isModeSelected = (option) => {
    const { input } = this.props;
    return input.value === option;
  }

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
        // eslint-disable-next-line react/jsx-props-no-spreading
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
        { label
          && <h4 className="form-fields-mode__label">{label}</h4>}
        <div className="form-fields-mode__options">
          { options.map(this.renderMode) }
        </div>
        { touched && invalid && <p className="form-fields-mode__error">{error}</p> }
      </div>
    );
  }
}

Mode.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.array,
  label: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  meta: PropTypes.object,
  className: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  input: PropTypes.object.isRequired,
};

Mode.defaultProps = {
  className: null,
  label: null,
  meta: { invalid: false, error: null, touched: false },
  options: [],
};

export default Mode;
