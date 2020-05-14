import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { getStageIndex } from '@selectors/protocol';
import { getFieldId } from '@app/utils/issues';
import scrollTo from '@app/utils/scrollTo';
import SectionsHeading from '@app/components/sections/SectionsHeading';

const StageHeading = ({
  stageNumber,
  name,
  type,
}) => {
  const handleEditName = () => {
    const nameFieldId = `#${getFieldId('label')}`;
    const destination = document.querySelector(nameFieldId);
    scrollTo(destination);
  };

  const location = stageNumber ? `Stage ${stageNumber}` : 'New Stage';
  const meta = type;

  return (
    <SectionsHeading
      location={location}
      meta={meta}
    >
      <div
        className="stage-heading__name-edit"
        onClick={handleEditName}
      >
        {name}
      </div>
    </SectionsHeading>
  );
};

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
