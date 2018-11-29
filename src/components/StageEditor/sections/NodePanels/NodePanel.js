import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import * as Fields from '../../../../ui/components/Fields';
import Select from '../../../Form/Fields/Select';
import Filter from '../../../Form/Fields/Filter';
import ValidatedField from '../../../Form/ValidatedField';
import { Item } from '../../../OrderedList';
import { getFieldId } from '../../../../utils/issues';

const getDataSourceOptions = (dataSources) => {
  const externalData = dataSources.map(dataSource => (
    { value: dataSource, label: dataSource }
  ));

  return ([
    { value: 'existing', label: 'Current network' },
    ...externalData,
  ]);
};

const NodePanel = ({ fieldId, dataSources, variableRegistry, ...rest }) => (
  <Item {...rest}>
    <div className="stage-editor-section-prompt__group">
      <div className="stage-editor-section-prompt__group-title">Panel title</div>
      <Field
        name={`${fieldId}.title`}
        component={Fields.Text}
        placeholder="Panel title"
      />
    </div>
    <div className="stage-editor-section-prompt__group">
      <div
        className="stage-editor-section-prompt__group-title"
        id={getFieldId(`${fieldId}.dataSource`)}
        data-name="Panel data source"
      >Data source</div>
      <ValidatedField
        name={`${fieldId}.dataSource`}
        component={Select}
        placeholder="&mdash; Select data source &mdash;"
        validation={{ required: true }}
        options={getDataSourceOptions(dataSources)}
      />
    </div>
    <div className="stage-editor-section-prompt__group">
      <div className="stage-editor-section-prompt__group-title">Filter</div>
      <Field
        name={`${fieldId}.filter`}
        component={Filter}
        variableRegistry={variableRegistry}
      />
    </div>
  </Item>
);

NodePanel.propTypes = {
  fieldId: PropTypes.string.isRequired,
  dataSources: PropTypes.array.isRequired,
  variableRegistry: PropTypes.object.isRequired,
};

export { NodePanel };

export default NodePanel;
