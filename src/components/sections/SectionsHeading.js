import React from 'react';
import PropTypes from 'prop-types';

const SectionsHeading = ({
  location,
  children,
  meta,
}) => (
  <div className="stage-heading">
    <div className="stage-heading__location">
      {location}
    </div>
    <div className="stage-heading__name">
      {children}
    </div>
    <div className="stage-heading__meta">
      {meta}
    </div>
  </div>
);

SectionsHeading.propTypes = {
  location: PropTypes.node,
  children: PropTypes.node,
  meta: PropTypes.node,
};

SectionsHeading.defaultProps = {
  location: null,
  children: null,
  meta: null,
};

export default SectionsHeading;
