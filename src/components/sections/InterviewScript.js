import React from 'react';
import { Section } from '@components/EditorLayout';
import Details from '@components/Details';
import { getFieldId } from '@app/utils/issues';
import { Field, formValueSelector } from 'redux-form';
import { Field as RichText } from '@codaco/ui/lib/components/Fields/RichText';
import { useSelector } from 'react-redux';

const summary = (<h2 id={getFieldId('interviewScript')}>Interviewer Script</h2>);

const InterviewerScript = () => {
  const getFormValue = formValueSelector('edit-stage');
  const currentValue = useSelector((state) => getFormValue(state, 'interviewScript'));

  return (
    <Section className="interview-script">
      <Details
        className="interview-script__details"
        summary={summary}
        startExpanded={!!currentValue}
      >
        <p>
          Use this section to create notes or a guide for the interviewer.
        </p>
        <Field
          name="interviewScript"
          component={RichText}
          placeholder="Enter text for the interviewer here."
        />
      </Details>
    </Section>
  );
};

export default InterviewerScript;
