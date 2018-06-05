import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { keys, get } from 'lodash';
import * as Fields from '../../../Form/Fields';

const NameGeneratorPrompt = ({
  fieldId,
  nodeTypes,
}) => (
  <div className="stage-editor-section-name-generator-prompt">
    <div className="stage-editor-section-name-generator-prompt__setting">
      <div className="stage-editor-section-name-generator-prompt__setting-label">Text for prompt</div>
      <Field
        name={`${fieldId}.text`}
        component={Fields.Markdown}
        className="stage-editor-section-name-generator-prompt__setting-value"
        placeholder="Enter text for the prompt here"
      />
    </div>
    <div className="stage-editor-section-name-generator-prompt__setting">
      <div className="stage-editor-section-name-generator-prompt__setting-label">Which nodes?</div>
      <Field
        name={`${fieldId}.subject`}
        parse={value => ({ type: value, entity: 'node' })}
        format={value => get(value, 'type')}
        options={nodeTypes}
        component={Fields.Contexts}
      />
    </div>
  </div>
);

NameGeneratorPrompt.propTypes = {
  fieldId: PropTypes.string.isRequired,
  nodeTypes: PropTypes.array.isRequired,
};

NameGeneratorPrompt.defaultProps = {
};

const mapStateToProps = state => ({
  nodeTypes: keys(state.protocol.present.variableRegistry.node),
});

export { NameGeneratorPrompt };

export default connect(
  mapStateToProps,
)(
  NameGeneratorPrompt,
);
