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
    className="form-fields-select__item form-fields-select__item__image"
    classNamePrefix="form-fields-select__item form-fields-select__item__image"
  >
    <div className="select-item select-item__image select-item__image--image">
      <img className="" src={getInputImage(props.data.image)} alt={props.data.label} />
      <h4>{props.data.label}</h4>
    </div>
    <div className="select-item select-item__image select-item__image--description">
      <p>{props.data.description}</p>
    </div>
  </Option>
);

export default SelectOptionImage;
