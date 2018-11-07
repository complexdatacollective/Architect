import React from 'react';
import { components as ReactSelectComponents } from 'react-select';
import { get } from 'lodash';

import inputImages from '../../../images/inputs';

const getInputImage = type =>
  get(inputImages, type);

const { Option } = ReactSelectComponents;

const SelectOptionImage = props => (
  <Option
    {...props}
    className="form-fields-select__item"
    classNamePrefix="form-fields-select__item"
  >
    { props.data.image ? (
      <img className="form-fields-select__item--image" src={getInputImage(props.data.image)} alt={props.data.label} />
    ) : ''}
    <h4>{props.data.label}</h4>
    <p>{props.data.description}</p>
  </Option>
);

export default SelectOptionImage;
