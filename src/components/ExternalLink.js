import React from 'react';
import PropTypes from 'prop-types';

const { shell } = require('electron');

export const openExternalLink = (href) => {
  shell.openExternal(href);
};

const ExternalLink = ({ children, href }) => {
  const handleClick = (event) => {
    event.preventDefault();
    openExternalLink(href);
  };

  return (
    // eslint-disable-next-line jsx-a11y/href-no-hash
    <a href="#" onClick={handleClick}>
      {children}
    </a>
  );
};

ExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export { ExternalLink };

export default ExternalLink;
