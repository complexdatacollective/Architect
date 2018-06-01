import React, { Component } from 'react';
import { fieldPropTypes } from 'redux-form';
import PropTypes from 'prop-types';
import { get, isString } from 'lodash';
import cx from 'classnames';
import uuid from 'uuid';

const toString = value => (isString(value) ? value : JSON.stringify(value));
const getValue = option => get(option, 'value', option);
const getLabel = option => get(option, 'label', toString(getValue(option)));

class RadioGroup extends Component {
  static propTypes = {
    options: PropTypes.array,
    ...fieldPropTypes,
  };

  static defaultProps = {
    options: [],
  };

  componentWillMount() {
    this.id = uuid();
  }

  onChange = ({ target: { value: index } }) =>
    this.props.input.onChange(getValue(this.props.options[index]));

  renderOption = (option, index) => {
    const {
      input: { value },
      name,
    } = this.props;
    const optionValue = getValue(option);
    const optionLabel = getLabel(option);
    const selected = optionValue === value;
    const optionClasses = cx(
      'form-fields-radio-group__option',
      { 'form-fields-radio-group__option--selected': selected },
    );

    return (
      <label className={optionClasses} htmlFor={`${this.id}_${index}`}>
        <input
          id={`${this.id}_${index}`}
          className="form-fields-radio-group__option-input"
          type="radio"
          name={name}
          value={index}
          checked={selected}
          onChange={this.onChange}
        />
        <div className="form-fields-radio-group__option-radio" />
        <div className="form-fields-radio-group__option-label">
          {optionLabel}
        </div>
      </label>
    );
  }

  render() {
    const {
      options,
      className,
      ...rest
    } = this.props;

    const classNames = cx(
      'form-fields-radio-group',
      className,
    );

    return (
      <div className={classNames} {...rest}>
        { options.map(this.renderOption) }
      </div>
    );
  }
}

export { RadioGroup };

export default RadioGroup;
