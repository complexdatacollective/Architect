import React from 'react';
import PropTypes from 'prop-types';
import { shell } from 'electron';

const ExternalLink = ({ children, url }) => {
  const handleClick = (event) => {
    event.preventDefault();
    shell.openExternal(url);
  };

  return (
    <a href="{url}" onClick={handleClick}>
      {children}
    </a>
  );
}

ExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  url: PropTypes.string.isRequired,
};

ExternalLink.defaultProps = {
  params: {},
};

export { ExternalLink };

export default ExternalLink;
