import React from 'react';
import PropTypes from 'prop-types';
import * as Fields from '@codaco/ui/lib/components/Fields';
import DataSource from '@components/Form/Fields/DataSource';
import ValidatedField from '@components/Form/ValidatedField';
import { Item, Row } from '@components/OrderedList';
import { getFieldId } from '@app/utils/issues';
import NetworkFilter from '@components/sections/fields/NetworkFilter';

const NodePanel = ({ fieldId, ...rest }) => (
  <Item {...rest}>
    <Row>
      <h3 id={getFieldId(`${fieldId}.title`)}>Panel title</h3>
      <p>The panel title will be shown above the list of nodes within the panel.</p>
      <ValidatedField
        name={`${fieldId}.title`}
        component={Fields.Text}
        placeholder="Panel title"
        validation={{ required: true }}
      />
    </Row>
    <Row>
      <h3
        id={getFieldId(`${fieldId}.dataSource`)}
        data-name="Panel data source"
      >Data source</h3>
      <p>
        Choose where the data for this panel should come from (either the in-progress interview
        session [&quot;People you have already named&quot;], or an external network data file
        that you have added).
      </p>
      <ValidatedField
        component={DataSource}
        name={`${fieldId}.dataSource`}
        validation={{ required: true }}
        canUseExisting
      />
    </Row>
    <NetworkFilter
      variant="contrast"
      name={`${fieldId}.filter`}
      title="Filter nodes displayed in this panel"
    />
  </Item>
);

NodePanel.propTypes = {
  fieldId: PropTypes.string.isRequired,
};

export { NodePanel };

export default NodePanel;
