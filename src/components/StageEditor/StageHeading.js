import React from 'react';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { getStage, getStageIndex } from '@selectors/protocol';

const StageHeading = ({
  stageNumber,
  name,
  type,
}) => {
  return (
    <div className="stage-heading">
      <div className="stage-heading__location">
        Stage {stageNumber}
      </div>
      <div className="stage-heading__name">
        {name}
      </div>
      <div className="stage-heading__meta">
        {type}
      </div>
    </div>
  );
};

const mapStateToProps = (state, { id }) => {
  const stage = getStage(state, id);
  const stageNumber = getStageIndex(state, id) + 1;
  const formValues = getFormValues('edit-stage')(state);

  return {
    stageNumber,
    name: formValues.label,
    type: stage.type,
  };
};

export { StageHeading };

export default connect(mapStateToProps)(StageHeading);
