import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'network-canvas-ui';
import { Zoom } from '../../behaviours';
import getCSSVariable from '../../utils/getCSSVariable';

const zoomColors = [getCSSVariable('--light-background'), getCSSVariable('--light-background')];

const AddNewButton = Zoom(
  ({ onInsertStage }) => (
    <button
      className="timeline-add-new__button"
      onClick={onInsertStage}
      style={{ display: 'inline-block' }}
    >
      <div className="timeline-add-new__button-label">Add new stage here</div>
      <Icon name="add-a-screen" className="timeline-add-new__button-icon" />
    </button>
  ),
);

const TimelineAddNew = ({ onInsertStage }) => (
  <div className="timeline-add-new">
    <AddNewButton
      zoomColors={zoomColors}
      onInsertStage={onInsertStage}
    />
  </div>
);

TimelineAddNew.propTypes = {
  onInsertStage: PropTypes.func.isRequired,
};

export default TimelineAddNew;
