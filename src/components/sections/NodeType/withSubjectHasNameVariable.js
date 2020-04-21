import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { toPairs } from 'lodash';
import { getVariablesForSubject } from '@selectors/codebook';

const withSubjectNameVariablesState = connect(
  (state, { form }) => {
    const subject = formValueSelector(form)(state, 'subject');
    const entity = subject && subject.entity;
    const type = subject && subject.type;
    const variablesCalledName = toPairs(getVariablesForSubject(state, { entity, type }))
      .some(([, { name }]) => name === 'name');

    return {
      ...subject,
      subjectHasVariableCalledName: !!variablesCalledName.length > 0,
    };
  },
);

export default withSubjectNameVariablesState;
