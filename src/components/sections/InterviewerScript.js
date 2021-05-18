import React from 'react';
import { Section } from '@components/EditorLayout';
import Details from '@components/Details';
import { getFieldId } from '@app/utils/issues';
import { Field } from 'redux-form';
import { Field as RichText } from '@codaco/ui/lib/components/Fields/RichText';

const InterviewerScript = () => (
  <Section className="interviewer-script">
    <Details
      className="interviewer-script__details"
      summary={(
        <h2 id={getFieldId('interviewScript')}>Interviewer Script</h2>
      )}
    >
      <p>
        Use this section to create notes or a guide for the interviewer.
        This copy will not be shown in Interviewer.
      </p>
      <Field
        name="interviewScript"
        component={RichText}
        placeholder="Enter text for the interviewer here."
      />
    </Details>
  </Section>
);

export default InterviewerScript;
