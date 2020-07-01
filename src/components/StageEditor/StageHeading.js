import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { noop } from 'lodash';
import { getStageIndex } from '@selectors/protocol';
import { getFieldId } from '@app/utils/issues';
import scrollTo from '@app/utils/scrollTo';
import { Heading } from '@app/components/EditorLayout';

const StageHeading = ({
  stageNumber,
  name,
  type,
  toggleCodeView,
}) => {
  const handleEditName = () => {
    const nameFieldId = `#${getFieldId('label')}`;
    const destination = document.querySelector(nameFieldId);
    scrollTo(destination);
  };

  const location = stageNumber ? `Stage ${stageNumber}` : 'New Stage';
  const meta = (<div onClick={toggleCodeView}>{type}</div>);

  return (
    <Heading
      location={location}
      meta={meta}
    >
      <div
        className="stage-heading__name-edit"
        onClick={handleEditName}
      >
        {name}
      </div>
    </Heading>
  );
};

StageHeading.propTypes = {
  stageNumber: PropTypes.number,
  name: PropTypes.string,
  type: PropTypes.string,
  toggleCodeView: PropTypes.func,
};

StageHeading.defaultProps = {
  stageNumber: null,
  name: '',
  type: '',
  toggleCodeView: noop,
};

const mapStateToProps = (state, { id }) => {
  const stageIndex = getStageIndex(state, id);
  const stageNumber = stageIndex !== -1 ? stageIndex + 1 : null;
  const formValues = getFormValues('edit-stage')(state);

  return {
    stageNumber,
    name: formValues.label,
    type: formValues.type,
  };
};

export { StageHeading };

export default connect(mapStateToProps)(StageHeading);
