import React from 'react';
import PropTypes from 'prop-types';
import Rules from './Rules';

const Query = ({ rules, join, codebook, onChange, openDialog, error, meta }) => (
  <Rules
    meta={meta}
    rules={rules}
    join={join}
    onChange={onChange}
    openDialog={openDialog}
    codebook={codebook}
    type="query"
    error={error}
  />
);

Query.propTypes = {
  onChange: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
  rules: PropTypes.array,
  codebook: PropTypes.object.isRequired,
  join: PropTypes.string,
  error: PropTypes.string,
  meta: PropTypes.object,
};

Query.defaultProps = {
  rules: [],
  join: null,
  error: null,
  meta: {},
};

export { Query };

export default Query;
