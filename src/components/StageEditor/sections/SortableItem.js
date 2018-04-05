import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import RoundButton from '../../Form/RoundButton';

const Handle = SortableHandle(() => (
  <div className="sortable-item__handle" />
));

const SortableItem = ({ remove, children }) => (
  <div className="sortable-item">
    <Handle />

    <div className="sortable-item__content">
      { children }
    </div>

    <RoundButton
      onClick={remove}
      type="button"
      icon="close"
      className="sortable-item__delete"
    />
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
