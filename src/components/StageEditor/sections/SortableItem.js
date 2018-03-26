import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { Icon } from 'network-canvas-ui';
import { Button } from '../../Form';

const Handle = SortableHandle(() => (
  <div className="sortable-item__handle" />
));

const SortableItem = ({ remove, children }) => (
  <div className="sortable-item">
    <Handle />

    <div className="sortable-item__content">
      { children }
    </div>

    <Button
      onClick={remove}
      className="sortable-item__delete"
    ><Icon name="close" /></Button>
  </div>
);

SortableItem.propTypes = {
  remove: PropTypes.func.isRequired,
  children: PropTypes.any,
};

SortableItem.defaultProps = {
  children: null,
};

export { SortableItem };

export default SortableElement(SortableItem);
