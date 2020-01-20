import { connect } from 'react-redux';
import { compose } from 'recompose';
import { formValueSelector } from 'redux-form';
import { getVariableOptionsForSubject } from '../../../selectors/codebook';

const withSubjectNameVariablesState = connect(
  (state, { form }) => {
    const subject = formValueSelector(form)(state, 'subject');
    const entity = subject && subject.entity;
    const type = subject && subject.type;
    const variablesCalledName = getVariableOptionsForSubject(state, { entity, type })
      .filter(({ label: variableLabel }) => variableLabel === 'name');

    return {
      ...subject,
      subjectHasVariableCalledName: !!variablesCalledName.length > 0,
    };
  },
);


const withSubjectVariables = compose(
  withSubjectNameVariablesState,
);

export default withSubjectVariables;
