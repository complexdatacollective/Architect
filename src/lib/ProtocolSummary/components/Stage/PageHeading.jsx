import React from 'react';
import PropTypes from 'prop-types';

const PageHeading = ({ heading }) => {
  if (!heading) { return null; }

  return (
    <div className="protocol-summary-stage__page-heading">
      <div className="protocol-summary-stage__page-heading-content">
        <h2 className="section-heading">Page Heading</h2>
        <h2>{heading}</h2>
      </div>
    </div>
  );
};

PageHeading.propTypes = {
  heading: PropTypes.string,
};

PageHeading.defaultProps = {
  heading: null,
};

export default PageHeading;
