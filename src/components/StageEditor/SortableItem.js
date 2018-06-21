import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';

const SortableItem = ({ children }) => (
  <div className="stage-editor-sortable-item">
    { children }
  </div>
);

SortableItem.propTypes = {
  children: PropTypes.any,
};

SortableItem.defaultProps = {
  children: null,
};

export { SortableItem };

export default SortableElement(SortableItem);
