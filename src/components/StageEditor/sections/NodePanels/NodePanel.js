import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import SeamlessText from '../../../Form/Fields/SeamlessText';
import Select from '../../../Form/Fields/Select';
import Filter from '../../../Form/Fields/Filter';
import ValidatedField from '../../../Form/ValidatedField';
import { Item } from '../../../Items';
import { getFieldId } from '../../../../utils/issues';

const NodePanel = ({ fieldId, dataSources, ...rest }) => (
  <Item {...rest}>
    <div className="stage-editor-section-prompt__group">
      <div className="stage-editor-section-prompt__group-title">Panel title</div>
      <Field
        name={`${fieldId}.title`}
        component={SeamlessText}
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
        placeholder="Panel title"
        validation={{ required: true }}
      >
        <option value="" disabled>&mdash; Select data source &mdash;</option>
        <option value="existing">Current network</option>
        {
          dataSources
            .map(dataSource => (
              <option key={dataSource} value={dataSource}>Protocol: {dataSource}</option>
            ))
        }
      </ValidatedField>
    </div>
    <div className="stage-editor-section-prompt__group">
      <div className="stage-editor-section-prompt__group-title">Filter</div>
      <Field
        name={`${fieldId}.filter`}
        component={Filter}
      />
    </div>
  </Item>
);

NodePanel.propTypes = {
  fieldId: PropTypes.string.isRequired,
  dataSources: PropTypes.array.isRequired,
};

export { NodePanel };

export default NodePanel;
