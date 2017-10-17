import React from 'react';
import PropTypes from 'prop-types';
import { Icon, colorDictionary as colors } from 'network-canvas-ui';
import { ZoomElement } from '../components';

const zoomColors = [colors.background, colors['light-background']];

const TimelineAddNew = ({ onInsertStage }) => (
  <ZoomElement className="timeline-add-new" colors={zoomColors}>
    <div
      className="timeline-add-new__button"
      role="button"
      onClick={onInsertStage}
      tabIndex="0"
      style={{ display: 'inline-block' }}
    >
      <Icon name="add-a-screen" className="timeline-add-new__icon" />
    </div>
  </ZoomElement>
);

TimelineAddNew.propTypes = {
  onInsertStage: PropTypes.func.isRequired,
};

export default TimelineAddNew;
