import React from 'react';
import { Section } from '@components/EditorLayout';
import { getFieldId } from '@app/utils/issues';
import { Field, formValueSelector } from 'redux-form';
import { Field as RichText } from '@codaco/ui/lib/components/Fields/RichText';
import { useSelector } from 'react-redux';

const InterviewerScript = () => {
  const getFormValue = formValueSelector('edit-stage');
  const currentValue = useSelector((state) => getFormValue(state, 'interviewScript'));

  return (
    <Section
      id={getFieldId('interviewScript')}
      className="interview-script"
      title="Interviewer Script"
      summary={(
        <p>
          Use this section to create notes or a guide for the interviewer.
        </p>
      )}
      toggleable
      startExpanded={!!currentValue}
    >
      <Field
        name="interviewScript"
        component={RichText}
        placeholder="Enter text for the interviewer here."
      />
    </Section>
  );
};

export default InterviewerScript;
