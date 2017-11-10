import React from 'react';
import PropTypes from 'prop-types';
import { Icon, colorDictionary } from 'network-canvas-ui';
import { Zoom } from '../behaviours';

const zoomColors = [colorDictionary.background, colorDictionary['light-background']];
const constrain = [60, 0, 0, 0];

const AddNewButton = Zoom(
  ({ onInsertStage }) => (
    <div
      className="timeline-add-new__button"
      role="button"
      tabIndex="0"
      onClick={onInsertStage}
      style={{ display: 'inline-block' }}
    >
      <div className="timeline-add-new__button-label">Add new stage here</div>
      <Icon name="add-a-screen" className="timeline-add-new__button-icon" />
    </div>
  ),
);

const TimelineAddNew = ({ onInsertStage }) => (
  <div className="timeline-add-new">
    <AddNewButton
      zoomColors={zoomColors}
      onInsertStage={onInsertStage}
      constrain={constrain}
    />
  </div>
);

TimelineAddNew.propTypes = {
  onInsertStage: PropTypes.func.isRequired,
};

export default TimelineAddNew;
