import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { range } from 'lodash';
import { fieldPropTypes } from 'redux-form';
import Icon from '@codaco/ui/lib/components/Icon';

const asColorOption = (name) => ({
  label: name,
  value: name,
});

class ColorPicker extends PureComponent {
  static propTypes = {
    ...fieldPropTypes,
    options: PropTypes.array,
    paletteRange: PropTypes.number,
  };

  static defaultProps = {
    options: [],
    paletteRange: 0,
  };

  get colors() {
    if (this.props.palette) {
      const { paletteRange } = this.props;

      return range(1, paletteRange)
        .map((index) => asColorOption(`${this.props.palette}-${index}`));
    }

    return this.props.options;
  }

  handleClick = (value) => {
    this.props.input.onChange(value);
  };

  renderColor = ({ label, value }) => {
    const colorClasses = cx(
      'form-fields-color-picker__color',
      { 'form-fields-color-picker__color--selected': this.props.input.value === value },
    );

    return (
      <div
        className={colorClasses}
        onClick={() => this.handleClick(value)}
        style={{ '--color': `var(--${value})` }}
        key={value}
      >
        <div className="form-fields-color-picker__color-label">{label}</div>
      </div>
    );
  }

  render() {
    const {
      label,
      meta: { error, invalid, touched },
    } = this.props;

    const colors = this.colors.map(this.renderColor);
    const showError = invalid && touched && error;

    const pickerStyles = cx(
      'form-fields-color-picker',
      { 'form-fields-color-picker--has-error': showError },
    );

    return (
      <div className="form-field-container">
        <div className={pickerStyles}>
          { label
            && <div className="form-fields-color-picker__label">{label}</div>}
          <div className="form-fields-color-picker__edit">
            <div className="form-fields-color-picker__colors">
              {colors}
            </div>
          </div>
          {showError
            && (
            <div className="form-fields-color-picker__error">
              <Icon name="warning" />
              {error}
            </div>
            )}
        </div>
      </div>
    );
  }
}

export default ColorPicker;
