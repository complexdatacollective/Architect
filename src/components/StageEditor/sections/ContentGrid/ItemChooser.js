import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const ItemChooser = ({ itemOptions, onChooseItem, show }) => (
  <div className={cx('content-grid-chooser', { 'content-grid-chooser--show': show })}>
    { itemOptions.map(itemType => (
      <div
        key={itemType}
        className="content-grid-chooser-item"
        onClick={(e) => { e.stopPropagation(); onChooseItem(itemType); }}
      >
        {itemType}
      </div>
    )) }
  </div>
);

ItemChooser.propTypes = {
  itemOptions: PropTypes.object,
  onChooseItem: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

ItemChooser.defaultProps = {
  itemOptions: [],
  show: false,
};

export default ItemChooser;
