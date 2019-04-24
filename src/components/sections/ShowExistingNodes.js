import React from 'react';
import { compose } from 'recompose';
import { Field } from 'redux-form';
import Checkbox from '../../ui/components/Fields/Checkbox';
import { getFieldId } from '../../utils/issues';
import withSubject from '../enhancers/withSubject';
import withDisabledSubjectRequired from '../enhancers/withDisabledSubjectRequired';
import Section from './Section';

const ShowExistingNodes = props => (
  <Section contentId="guidance.editor.show-existing-nodes" {...props}>
    <h3 id={getFieldId('showExistingNodes')}>Show existing nodes</h3>
    <p>
      Show nodes added from other prompts, otherwise only nodes added on this
      prompt will be shown.
    </p>
    <Field
      name="showExistingNodes"
      component={Checkbox}
      label="Show existing nodes"
    />
  </Section>
);

export { ShowExistingNodes };

export default compose(
  withSubject,
  withDisabledSubjectRequired,
)(ShowExistingNodes);
