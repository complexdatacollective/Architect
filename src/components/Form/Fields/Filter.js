import React from 'react';
import { fieldPropTypes } from 'redux-form';
import FilterControls from '../../Filter';

const defaultFilter = {
  join: '',
  rules: [],
};

const Filter = ({ input, ...rest }) => (
  <FilterControls
    filter={{ ...defaultFilter, ...input.value }}
    onChange={input.onChange}
    {...rest}
  />
);

Filter.propTypes = {
  ...fieldPropTypes,
};

export default Filter;
