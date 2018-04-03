/* eslint-disable */
import React, { Component } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import cx from 'classnames';
import uuid from 'uuid';

const NodeTypeOption = ({ selected, value }) => {

  return <div className={optionClasses}>{value}</div>;
};
class Contexts extends Component {
  componentWillMount() {
    this.id = uuid();
  }

  onChange = (event) => this.props.input.onChange(event.target.value);

  renderOption = (optionValue, index) => {
    const {
      input: { value },
      name,
    } = this.props;
    const selected = optionValue === value;
    const optionClasses = cx(
      'form-fields-contexts__option',
      { 'form-fields-contexts__option--selected': selected }
    );

    return (
      <label
        htmlFor={`${this.id}_${index}`}
        className={optionClasses}
      >
        <input
          id={`${this.id}_${index}`}
          className='form-fields-contexts__option-input'
          type="radio"
          name={name}
          value={optionValue}
          checked={selected}
          onChange={this.onChange}
        />
        { optionValue }
      </label>
    );
  }

  render() {
    const {
      input: {
        value,
      },
      options,
      className,
      ...rest
    } = this.props;

    const classNames = cx(
      'form-fields-contexts',
      className,
    );

    return (
      <div className={classNames} {...rest}>
        { options.map(this.renderOption) }
      </div>
    );
  }
};

export { Contexts };

export default Contexts;
