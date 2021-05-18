import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import Asset from '../Asset';

const Items = ({ items }) => {
  if (!items) { return null; }

  return (
    <div className="protocol-summary-stage__items">
      <h2>Content</h2>
      <div className="protocol-summary-stage__items-content">
        {items.map(({ type, content }) => {
          switch (type) {
            case 'asset':
              return (
                <div className="protocol-summary-stage__items-item">
                  <Asset id={content} />
                </div>
              );
            default:
              return (
                <div className="protocol-summary-stage__items-item--text">
                  <ReactMarkdown source={content} />
                </div>
              );
          }
        })}
      </div>
    </div>
  );
};

Items.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      content: PropTypes.string,
      size: PropTypes.string,
    }),
  ),
};

Items.defaultProps = {
  items: null,
};

export default Items;
