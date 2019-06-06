import React from 'react';
import PropTypes from 'prop-types';
import Rules from '../Rules';

const Query = ({ rules, join, codebook, onChange, openDialog }) => (
  <Rules
    rules={rules}
    join={join}
    onChange={onChange}
    openDialog={openDialog}
    codebook={codebook}
    type="query"
  />
);

Query.propTypes = {
  onChange: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
  rules: PropTypes.array,
  codebook: PropTypes.object.isRequired,
  join: PropTypes.string.isRequired,
};

Query.defaultProps = {
  rules: [],
};

export { Query };

export default Query;
