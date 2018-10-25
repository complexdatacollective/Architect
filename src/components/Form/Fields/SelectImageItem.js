import React from 'react';
import { components } from 'react-select';
import { get } from 'lodash';

import inputImages from '../../../images/inputs';

const getInputImage = type =>
  get(inputImages, type);

const { Option } = components;

const SelectImageIcon = props => (
  <Option {...props} className="select-option">
    { props.data.image ? (
      <img className="select-option__image" src={getInputImage(props.data.image)} alt={props.data.label} />
    ) : ''} 
    <h4>{props.data.label}</h4>
    <p>{props.data.description}</p>
  </Option>
);

export default SelectImageIcon;
