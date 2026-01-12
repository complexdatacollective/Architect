import React from 'react';
import PropTypes from 'prop-types';
import Markdown from '@codaco/ui/lib/components/Fields/Markdown';
import Asset from '../Asset';
import MiniTable from '../MiniTable';

const Items = ({ items }) => {
  if (!items) { return null; }

  return (
    <div className="protocol-summary-stage__items">
      <div className="protocol-summary-stage__items-content">
        <h2 className="section-heading">Items</h2>
        {items.map(({
          type, content, size, id,
        }) => {
          switch (type) {
            case 'asset':
              return (
                <div className="protocol-summary-stage__items-item" key={id}>
                  <Asset id={content} size={size} />
                </div>
              );
            default:
              return (
                <div className="protocol-summary-stage__items-item--text" key={id}>
                  <MiniTable
                    rotated
                    rows={[
                      ['Block Size', size],
                      ['Type', 'Text'],
                      // eslint-disable-next-line jsx-a11y/media-has-caption
                      ['Content', <Markdown label={content} />],
                    ]}
                  />
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
