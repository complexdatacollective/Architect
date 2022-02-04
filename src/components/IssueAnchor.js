import React from 'react';
import PropTypes from 'prop-types';
import { getFieldId } from '../utils/issues';

const IssueAnchor = ({ fieldName = '', description = '' }) => (
  <div
    id={getFieldId(fieldName)}
    data-name={description}
  />
);

IssueAnchor.propTypes = {
  fieldName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default IssueAnchor;
