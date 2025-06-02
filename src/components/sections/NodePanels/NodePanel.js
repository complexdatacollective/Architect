import React from 'react';
import PropTypes from 'prop-types';
import * as Fields from '@codaco/ui/lib/components/Fields';
import DataSource from '@components/Form/Fields/DataSource';
import ValidatedField from '@components/Form/ValidatedField';
import NetworkFilter from '@components/sections/fields/NetworkFilter';
import Section from '../../EditorLayout/Section';

const NodePanel = ({ fieldId, form }) => (
  <>
    <Section
      title="Panel Title"
      summary={(
        <p>The panel title will be shown above the list of nodes within the panel.</p>
      )}
    >
      <ValidatedField
        name={`${fieldId}.title`}
        component={Fields.Text}
        placeholder="Panel title"
        validation={{ required: true }}
        issueDescription="Panel title"
      />
    </Section>
    <Section
      title="Data Source"
      summary={(
        <p>
          Choose where the data for this panel should come from (either the in-progress interview
          session [&quot;People you have already named&quot;], or an external network data file
          that you have added).
        </p>
      )}
    >
      <ValidatedField
        component={DataSource}
        name={`${fieldId}.dataSource`}
        validation={{ required: true }}
        canUseExisting
        issueDescription="Panel data source"
      />
    </Section>
    <NetworkFilter
      form={form}
      variant="contrast"
      name={`${fieldId}.filter`}
      title="Filter nodes displayed in this panel"
    />
  </>
);

NodePanel.propTypes = {
  fieldId: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired,
};

export default NodePanel;
