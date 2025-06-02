import React from 'react';
import PropTypes from 'prop-types';
import { getFieldId } from '../utils/issues';

const IssueAnchor = ({
  fieldName, issueFieldName, description, children,
}) => (
  <div
    id={getFieldId(issueFieldName ?? fieldName)}
    data-name={description}
  >
    {children}
  </div>
);

IssueAnchor.defaultProps = {
  issueFieldName: null,
  children: null,
};

IssueAnchor.propTypes = {
  fieldName: PropTypes.string.isRequired,
  issueFieldName: PropTypes.string,
  description: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default IssueAnchor;
