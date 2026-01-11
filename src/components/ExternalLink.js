import React from 'react';
import PropTypes from 'prop-types';
import { electronAPI } from '@utils/electronBridge';

export const openExternalLink = (href) => {
  electronAPI.shell.openExternal(href);
};

const ExternalLink = ({ children, href }) => {
  const handleClick = (event) => {
    event.preventDefault();
    openExternalLink(href);
  };

  return (
    <a href="{href}" onClick={handleClick}>
      {children}
    </a>
  );
};

ExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export default ExternalLink;
