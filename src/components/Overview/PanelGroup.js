import React from 'react';
import PropTypes from 'prop-types';

const PanelGroup = ({ title, children }) => (
  <div className="timeline-overview__group">
    <h3 className="timeline-overview__group-title">{title}</h3>
    { !children && <p>No {title} options.</p> }
    { children }
  </div>
);

PanelGroup.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

PanelGroup.defaultProps = {
  title: '',
  children: null,
};

export default PanelGroup;
