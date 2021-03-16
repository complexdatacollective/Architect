import React from 'react';
import PropTypes from 'prop-types';
import { components as ReactSelectComponents } from 'react-select';

const { Option } = ReactSelectComponents;

const SelectOptionVariable = (props) => {
  const {
    data: {
      label,
      name,
      description,
    },
  } = props;

  return (
    <Option
      {...props}
      className="form-fields-select__item"
      classNamePrefix="form-fields-select__item"
    >
      <h4>
        {label}
        {' '}
        <span className="select-item__variable--variable-name">
          &lt;
          {name}
          &gt;
        </span>
      </h4>
      <p>{description}</p>
    </Option>
  );
};

SelectOptionVariable.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SelectOptionVariable;
