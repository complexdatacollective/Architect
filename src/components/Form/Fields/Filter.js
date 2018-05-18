import React from 'react';
import { fieldPropTypes } from 'redux-form';
import FilterGroup from '../../FilterGroup';

const defaultFilter = {
  join: '',
  rules: [],
};

const Filter = ({ input, ...rest }) => (
  <FilterGroup
    filter={{ ...defaultFilter, ...input.value }}
    onChange={input.onChange}
    {...rest}
  />
);

Filter.propTypes = {
  ...fieldPropTypes,
};

export default Filter;
