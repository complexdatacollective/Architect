import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button } from '../../../../ui/components';

const itemOptions = [
  'text',
  'image',
  'video',
  'audio',
];

const ItemChooser = ({ onChooseItemType, show }) => (
  <div className={cx('content-grid-chooser', { 'content-grid-chooser--show': show })}>
    { itemOptions.map(itemType => (
      <Button
        key={itemType}
        type="button"
        className="button button--small content-grid-chooser__type"
        onClick={(e) => { e.stopPropagation(); onChooseItemType(itemType); }}
      >
        {itemType}
      </Button>
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

export { ItemChooser };

export default ItemChooser;
