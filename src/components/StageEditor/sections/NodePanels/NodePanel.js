import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import * as Fields from '../../../../ui/components/Fields';
import DataSource from '../../../Form/Fields/DataSource';
import { Filter, withFieldConnector, withStoreConnector } from '../../../Query';
import ValidatedField from '../../../Form/ValidatedField';
import { Item, Row } from '../../../OrderedList';
import { getFieldId } from '../../../../utils/issues';

const FilterField = withFieldConnector(withStoreConnector(Filter));

const NodePanel = ({ fieldId, ...rest }) => (
  <Item {...rest}>
    <Row>
      <h3>Panel title</h3>
      <Field
        name={`${fieldId}.title`}
        component={Fields.Text}
        placeholder="Panel title"
      />
    </Row>
    <Row>
      <h3
        id={getFieldId(`${fieldId}.dataSource`)}
        data-name="Panel data source"
      >Data source</h3>
      <ValidatedField
        component={DataSource}
        name={`${fieldId}.dataSource`}
        validation={{ required: true }}
        canUseExisting
      />
    </Row>
    <Row>
      <h3>Filter</h3>
      <Field
        name={`${fieldId}.filter`}
        component={FilterField}
      />
    </Row>
  </Item>
);

NodePanel.propTypes = {
  fieldId: PropTypes.string.isRequired,
};

export { NodePanel };

export default NodePanel;
