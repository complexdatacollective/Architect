import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { getStageIndex } from '@selectors/protocol';

const StageHeading = ({
  stageNumber,
  name,
  type,
}) => (
  <div className="stage-heading">
    <div className="stage-heading__location">
      { stageNumber && `Stage ${stageNumber}` }
      { !stageNumber && 'New Stage' }
    </div>
    <div className="stage-heading__name">
      {name}
    </div>
    <div className="stage-heading__meta">
      {type}
    </div>
  </div>
);

StageHeading.propTypes = {
  stageNumber: PropTypes.number,
  name: PropTypes.string,
  type: PropTypes.string,
};

StageHeading.defaultProps = {
  stageNumber: null,
  name: '',
  type: '',
};

const mapStateToProps = (state, { id }) => {
  const stageIndex = getStageIndex(state, id);
  const stageNumber = stageIndex !== -1 && stageIndex + 1;
  const formValues = getFormValues('edit-stage')(state);

  return {
    stageNumber,
    name: formValues.label,
    type: formValues.type,
  };
};

export { StageHeading };

export default connect(mapStateToProps)(StageHeading);
