import { Row, Section } from '@components/EditorLayout';

import { Field as RichText } from '@codaco/ui/lib/components/Fields/RichText';
import TextField from '@codaco/ui/lib/components/Fields/Text';

import { ValidatedField } from '../Form';

const Name = () => {
  const summaryText =
    'This panel is shown prior to completion of the forms, and should serve as an introduction to the task.';

  return (
    <Section title="Introduction Panel" summary={<p>{summaryText}</p>}>
      <Row>
        <ValidatedField
          name="introductionPanel.title"
          issueDescription="Title (Introduction panel)"
          label="Title"
          component={TextField}
          maxLength="50"
          validation={{ required: true }}
        />
      </Row>
      <Row>
        <ValidatedField
          name="introductionPanel.text"
          label="Introduction text"
          component={RichText}
          validation={{ required: true }}
        />
      </Row>
    </Section>
  );
};

export default Name;
