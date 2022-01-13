import React from 'react';
import PropTypes from 'prop-types';

const CodebookCategory = ({ title, children }) => (
  <div className="codebook-category">
    <h2>{title}</h2>
    <div className="codebook__category-items">
      {children}
    </div>
  </div>
);

CodebookCategory.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

CodebookCategory.defaultProps = {
  title: '',
  children: null,
};

export default CodebookCategory;
