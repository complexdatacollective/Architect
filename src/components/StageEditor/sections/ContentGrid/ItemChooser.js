import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const itemOptions = [
  'text',
  'image',
  'video',
  'audio',
];

const ItemChooser = ({ onChooseItemType, show }) => (
  <div className={cx('content-grid-chooser', { 'content-grid-chooser--show': show })}>
    { itemOptions.map(itemType => (
      <div
        key={itemType}
        className="content-grid-chooser-item"
        onClick={(e) => { e.stopPropagation(); onChooseItemType(itemType); }}
      >
        {itemType}
      </div>
    )) }
  </div>
);

ItemChooser.propTypes = {
  onChooseItemType: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

ItemChooser.defaultProps = {
  show: false,
};

export default ItemChooser;
