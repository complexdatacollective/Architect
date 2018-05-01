import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../ui/src/components';
import { Zoom } from '../../behaviours';
import { getCSSVariableAsString } from '../../utils/CSSVariables';

const zoomColors = [getCSSVariableAsString('--light-background'), getCSSVariableAsString('--light-background')];

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
