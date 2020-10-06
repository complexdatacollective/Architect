import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { noop } from 'lodash';
import { getStageIndex } from '@selectors/protocol';
import { getFieldId } from '@app/utils/issues';
import scrollTo from '@app/utils/scrollTo';

const StageHeading = ({
  stageNumber,
  name,
  type,
  toggleCodeView,
  children,
}) => {
  const handleEditName = () => {
    const nameFieldId = `#${getFieldId('label')}`;
    const destination = document.querySelector(nameFieldId);
    scrollTo(destination);
  };

  const location = stageNumber ? `Stage ${stageNumber}` : 'New Stage';
  const meta = (<div onClick={toggleCodeView}>{type}</div>);

  return (
    <div className="stage-editor-section stage-heading">
      <div className="stage-heading">
        <div className="stage-heading__location">
          {location}
        </div>
        <div className="stage-heading__name">
          <div
            className="stage-heading__name-edit"
            onClick={handleEditName}
          >
            {name}
          </div>
        </div>
        <div className="stage-heading__meta">
          {meta}
        </div>
      </div>
      {children}
    </div>
  );
};

StageHeading.propTypes = {
  stageNumber: PropTypes.number,
  name: PropTypes.string,
  type: PropTypes.string,
  toggleCodeView: PropTypes.func,
  children: PropTypes.any,
};

StageHeading.defaultProps = {
  stageNumber: null,
  name: '',
  type: '',
  toggleCodeView: noop,
  children: null,
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
