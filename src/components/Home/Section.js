import React from 'react';
import PropTypes from 'prop-types';

const Section = ({ title, children, sidebar }) => (
  <div className="home-section">
    <div className="home-section__main">
      <h2>{title}</h2>
      {children}
    </div>
    { sidebar &&
      <div className="home-section__sub">
        {sidebar}
      </div>
    }
  </div>
);

Section.propTypes = {
  title: PropTypes.string.isRequired,
  sidebar: PropTypes.node,
  children: PropTypes.node,
};

Section.defaultProps = {
  children: null,
  sidebar: null,
};

export default React;
