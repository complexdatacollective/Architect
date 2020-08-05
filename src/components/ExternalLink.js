import React from 'react';
import PropTypes from 'prop-types';
import { shell } from 'electron';

export const openExternalLink = (event, href) => {
  event.preventDefault();
  shell.openExternal(href);
};

const ExternalLink = ({ children, href }) => {
  const handleClick = (event) => {
    openExternalLink(event, href);
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

ExternalLink.defaultProps = {
  params: {},
};

export { ExternalLink };

export default ExternalLink;
