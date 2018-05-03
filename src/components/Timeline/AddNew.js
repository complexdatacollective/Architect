import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../ui/components';
import { Zoom } from '../../behaviours';
import { getCSSVariableAsString } from '../../utils/CSSVariables';

const zoomColors = [getCSSVariableAsString('--light-background'), getCSSVariableAsString('--light-background')];

const AddNewButton = Zoom(
  ({ onInsertStage }) => (
    <Button
      color="cyber-grape"
      onClick={onInsertStage}
    >
      Create first stage
    </Button>
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
