import React from 'react';
import { compose } from 'recompose';
import { Section, Row } from '@components/EditorLayout';
import { getFieldId } from '../../utils/issues';
import DataSource from '../Form/Fields/DataSource';
import ValidatedField from '../Form/ValidatedField';
import withSubject from '../enhancers/withSubject';
import withDisabledSubjectRequired from '../enhancers/withDisabledSubjectRequired';

const ExternalDataSource = props => (
  <Section contentId="guidance.editor.externalData" {...props}>
    <Row>
      <div id={getFieldId('dataSource')} data-name="Roster data-source" />
      <h3>External Data-source for Roster</h3>
      <p>
        This stage needs a source of nodes to populate the roster.
        Select a network data file to use.
      </p>
      <ValidatedField
        component={DataSource}
        name="dataSource"
        id="dataSource"
        validation={{ required: true }}
      />
    </Row>
  </Section>
);

export { ExternalDataSource };

export default compose(
  withSubject,
  withDisabledSubjectRequired,
)(ExternalDataSource);

