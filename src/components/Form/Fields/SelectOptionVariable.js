import React from 'react';
import { components } from 'react-select';

const { Option } = components;

const SelectOptionVariable = props => (
  <Option
    {...props}
    className="form-fields-select__item"
    classNamePrefix="form-fields-select__item"
  >
    <h4>
      {props.data.name} <span className="select-item__variable--variable-name">&lt;{props.data.label}&gt;</span>
    </h4>
    <p>{props.data.description}</p>
  </Option>
);

export default SelectOptionVariable;
