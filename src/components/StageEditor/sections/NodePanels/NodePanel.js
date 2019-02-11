import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import * as Fields from '../../../../ui/components/Fields';
import Select from '../../../Form/Fields/Select';
import { Filter, withFieldConnector, withStoreConnector } from '../../../Query';
import ValidatedField from '../../../Form/ValidatedField';
import { Item, Row } from '../../../OrderedList';
import { getFieldId } from '../../../../utils/issues';

const FilterField = withFieldConnector(withStoreConnector(Filter));

const getDataSourceOptions = (dataSources) => {
  const externalData = dataSources.map(dataSource => (
    { value: dataSource, label: dataSource }
  ));

  return ([
    { value: 'existing', label: 'Current network' },
    ...externalData,
  ]);
};

const NodePanel = ({ fieldId, dataSources, ...rest }) => (
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
        name={`${fieldId}.dataSource`}
        component={Select}
        placeholder="&mdash; Select data source &mdash;"
        validation={{ required: true }}
        options={getDataSourceOptions(dataSources)}
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
  dataSources: PropTypes.array.isRequired,
};

export { NodePanel };

export default NodePanel;
