import React, { PureComponent } from 'react';
import cx from 'classnames';
import Color from 'color';
import { get, find, map, range } from 'lodash';
import { CirclePicker } from 'react-color';
import { fieldPropTypes } from 'redux-form';
import { getCSSVariableAsString } from '../../../utils/CSSVariables';

const getColorByVariable = (variable) => {
  try {
    return Color(getCSSVariableAsString(variable)).hex().toLowerCase();
  } catch (e) {
    return '';
  }
};

const COLOR_OPTIONS = range(1, 8)
  .map(
    i =>
      ({
        name: `--node-color-seq-${i}`,
        color: getColorByVariable(`--node-color-seq-${i}`),
      }),
  );

const COLORS = map(COLOR_OPTIONS, 'color');

const findColorOption = ({ hex }) =>
  find(COLOR_OPTIONS, { color: hex });

class ColorPicker extends PureComponent {
  static propTypes = {
    ...fieldPropTypes,
  };

  get color() {
    return getColorByVariable(this.props.input.value);
  }

  handleChange = (colorValues) => {
    const color = get(findColorOption(colorValues), 'name', '');
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
            colors={COLORS}
            onChangeComplete={this.handleChange}
          />
        </div>
      </div>
    );
  }
}

export default ColorPicker;
