import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import SeamlessText from '../../../Form/Fields/SeamlessText';
import Select from '../../../Form/Fields/Select';
import Filter from '../../../Form/Fields/Filter';

const NodePanel = ({ fieldId, dataSources }) => (
  <div className="stage-editor-section-name-generator-prompt">
    <div className="stage-editor-section-name-generator-prompt__setting">
      <div className="stage-editor-section-name-generator-prompt__setting-label">Panel title</div>
      <Field
        name={`${fieldId}.title`}
        component={SeamlessText}
        className="stage-editor-section-name-generator-prompt__setting-value"
        placeholder="Panel title"
      />
    </div>
    <div className="stage-editor-section-name-generator-prompt__setting">
      <div className="stage-editor-section-name-generator-prompt__setting-label">Data source</div>
      <Field
        name={`${fieldId}.dataSource`}
        component={Select}
        className="stage-editor-section-name-generator-prompt__setting-value"
        placeholder="Panel title"
        defaultValue=""
      >
        <option value="" disabled>Select data source</option>
        <option key="existing" value="existing">Current network</option>
        {
          dataSources
            .map(dataSource => (
              <option key={dataSource} value={dataSource}>Protocol: {dataSource}</option>
            ))
        }
      </Field>
    </div>
    <div className="stage-editor-section-name-generator-prompt__setting">
      <div className="stage-editor-section-name-generator-prompt__setting-label">Filter</div>
      <Field
        name={`${fieldId}.filter`}
        component={Filter}
        className="stage-editor-section-name-generator-prompt__setting-value"
      />
    </div>

  </div>
);

NodePanel.propTypes = {
  fieldId: PropTypes.string.isRequired,
  dataSources: PropTypes.array.isRequired,
};

export { NodePanel };

export default NodePanel;
