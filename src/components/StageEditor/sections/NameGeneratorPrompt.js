/* eslint-disable */

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { get, toPairs } from 'lodash';
import { Icon } from 'network-canvas-ui';
import { SeamlessTextInput, Button, VariableChooser } from '../../Form';
import SortableItem from './SortableItem';

const NameGeneratorPrompt = ({ variables, additionalAttributes, text, id, onChange, onDelete, index }) => {
  return (
    <SortableItem onDelete={onDelete} index={index}>
      <div className="prompt">
        <label className="prompt__setting">
          <div className="prompt__setting-label">Export ID</div>
          <SeamlessTextInput
            className="prompt__setting-value"
            value={id}
            placeholder="Enter an ID for data export"
            onChange={(newValue) => { onChange({ id: newValue }) }}
          />
        </label>
        <label className="prompt__setting">
          <div className="prompt__setting-label">Text for prompt</div>
          <SeamlessTextInput
            className="prompt__setting-value"
            value={text}
            placeholder="Enter text for the prompt here"
            onChange={(newValue) => { onChange({ text: newValue }) }}
          />
        </label>
        <div className="prompt__setting">
          <div className="prompt__setting-label">Additional attributes</div>
          <VariableChooser
            className="prompt__setting-value"
            values={additionalAttributes}
            variables={variables}
            onChange={(newValue) => { onChange({ additionalAttributes: newValue }) }}
          />
        </div>
      </div>
    </SortableItem>
  );
}

const mapStateToProps = (state, props) => {
  const variableRegistry = get(state, 'protocol.present.variableRegistry', {});
  const { type } = get(props, 'stage.subject', {});
  const variablesForNodeType = get(variableRegistry, ['node', type, 'variables'], {});

  return {
    variables: variablesForNodeType,
  };
};

export { NameGeneratorPrompt };

export default compose(
  connect(mapStateToProps),
)(NameGeneratorPrompt);
