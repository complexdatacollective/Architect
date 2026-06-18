import { electronAPI } from '@utils/electronBridge';
import PropTypes from 'prop-types';

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
