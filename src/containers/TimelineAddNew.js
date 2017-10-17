import React from 'react';
import PropTypes from 'prop-types';
import { ZoomElement } from '../components';

const TimelineAddNew = ({ onInsertStage }) => (
  <ZoomElement>
    <div
      className="timeline-add-new"
      role="button"
      onClick={onInsertStage}
      tabIndex="0"
      style={{ display: 'inline-block' }}
    >
      Add Stage
    </div>
  </ZoomElement>
);

TimelineAddNew.propTypes = {
  onInsertStage: PropTypes.func.isRequired,
};

export default TimelineAddNew;
