import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { range } from 'lodash';
import { fieldPropTypes } from 'redux-form';

const asColorOption = name => ({
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
      const paletteRange = this.props.paletteRange;

      return range(1, paletteRange)
        .map(index => asColorOption(`${this.props.palette}-${index}`));
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
      >
        <div className="form-fields-color-picker__color-label">{label}</div>
      </div>
    );
  }

  render() {
    const {
      label,
    } = this.props;

    const colors = this.colors.map(this.renderColor);

    return (
      <div
        className={cx('form-fields-color-picker')}
      >
        { label &&
          <div className="form-fields-color-picker__label">{label}</div>
        }
        <div className="form-fields-color-picker__edit">
          <div className="form-fields-color-picker__colors">
            {colors}
          </div>
        </div>
      </div>
    );
  }
}

export default ColorPicker;
