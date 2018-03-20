/* eslint-disable */

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { get, toPairs } from 'lodash';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { Icon } from 'network-canvas-ui';
import { SeamlessTextInput, Button, VariableChooser } from '../../Form';

const Handle = SortableHandle(() => (
  <div className="stage-editor-section-content-item__handle" />
));

const NameGeneratorPrompt = ({ variables, additionalAttributes, text, id, onChange, onDelete }) => {
  return (
    <div className="prompt">
      <Handle />

      <div>
        <label>
          <div>ID</div>
          <SeamlessTextInput
            value={id}
            placeholder="Enter prompt text here"
            onChange={(newValue) => { onChange({ id: newValue }) }}
          />
        </label>
        <label>
          <div>Prompt text</div>
          <SeamlessTextInput
            value={text}
            placeholder="Enter prompt text here"
            onChange={(newValue) => { onChange({ text: newValue }) }}
          />
        </label>
        <VariableChooser
          values={additionalAttributes}
          variables={variables}
          onChange={(newValue) => { onChange({ additionalAttributes: newValue }) }}
        />
      </div>

      <Button
        onClick={onDelete}
      ><Icon name="close" /></Button>
    </div>
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
  SortableElement,
  connect(mapStateToProps),
)(NameGeneratorPrompt);
