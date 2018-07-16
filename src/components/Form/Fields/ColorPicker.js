import React, { PureComponent } from 'react';
import cx from 'classnames';
import { get, find, map } from 'lodash';
import { CirclePicker } from 'react-color';
import { fieldPropTypes } from 'redux-form';

class ColorPicker extends PureComponent {
  static propTypes = {
    ...fieldPropTypes,
  };

  get color() {
    return get(
      this.findColorOption({ name: this.props.input.value }),
      'color',
      '',
    );
  }

  get colors() {
    return map(this.props.colors, 'color');
  }

  findColorOption = properties =>
    find(this.props.colors, properties)

  handleChange = ({ hex }) => {
    const color = get(this.findColorOption({ color: hex }), 'name', '');
    this.props.input.onChange(color);
  };

  render() {
    const {
      label,
    } = this.props;

    return (
      <div
        className={cx('form-fields-color-picker')}
      >
        { label &&
          <div className="form-fields-color-picker__label">{label}</div>
        }
        <div className="form-fields-color-picker__edit">
          <CirclePicker
            className={cx('form-fields-color-picker__input')}
            color={this.color}
            triangle="hide"
            colors={this.colors}
            onChangeComplete={this.handleChange}
          />
        </div>
      </div>
    );
  }
}

export default ColorPicker;
