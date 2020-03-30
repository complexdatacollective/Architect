import { connect } from 'react-redux';
import { compose } from 'recompose';
// import { formValueSelector } from 'redux-form';
import { getVariableOptionsForSubject } from '../../../selectors/codebook';
import { getStage } from '../../../selectors/protocol';

const withSubjectNameVariablesState = connect(
  (state, { stageId }) => {
    // // const subject = formValueSelector(form)(state, 'subject');
    const stageEntry = getStage(state, stageId);
    const subject = (stageEntry && stageEntry.subject) || { entity: null, type: null };
    const entity = subject && subject.entity;
    const type = subject && subject.type;
    const variablesCalledName = getVariableOptionsForSubject(state, { entity, type })
      .filter(({ label: variableLabel }) => variableLabel === 'name');

    return {
      // ...subject,
      subjectHasVariableCalledName: !!variablesCalledName.length > 0,
    };
  },
);


const withSubjectVariables = compose(
  withSubjectNameVariablesState,
);

export default withSubjectVariables;
