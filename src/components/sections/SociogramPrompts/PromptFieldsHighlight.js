import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { compose } from 'recompose';
import Guidance from '../../Guidance';
import * as ArchitectFields from '../../Form/Fields';
import * as Fields from '../../../ui/components/Fields';
import Section from '../Section';
import withCreateVariableHandlers from '../../enhancers/withCreateVariableHandler';
import withHighlightOptions from './withHighlightOptions';
import withEdgeHighlightChangeHandler from './withEdgeHighlightChangeHandler';

const HighlightFields = ({
  allowHighlighting,
  unusedHighlightVariablesForNodeType,
  highlightVariablesForNodeType,
  handleEdgeHighlightChange,
  handleCreateVariable,
  canCreateEdge,
  setCanCreateEdge,
}) => {
  const handleChangeAllowHighlighting = (value) => {
    handleEdgeHighlightChange();
    setCanCreateEdge(!value && canCreateEdge);
  };

  return (
    <Guidance contentId="guidance.editor.sociogram_prompt.attributes">
      <Section group>
        <h3>Attributes</h3>
        <p>
          Use this section to configure node highlighting. Choose a
          boolean variable below, and nodes with this attribute will
          automatically be highlighted. You can also allow the
          participant to toggle this attribute by simply tapping (or
          clicking) a node.
        </p>
        <Field
          component={Fields.Toggle}
          name="highlight.allowHighlighting"
          onChange={handleChangeAllowHighlighting}
          label="Toggle this attribute by tapping on a node"
        />

        { allowHighlighting &&
          <Field
            name="highlight.variable"
            component={ArchitectFields.CreatableSelect}
            label="Toggle nodes with the following attribute:"
            onCreateOption={value => handleCreateVariable(value, 'boolean')}
            placeholder="&mdash; Select a variable to toggle &mdash;"
            options={unusedHighlightVariablesForNodeType}
          />
        }

        { !allowHighlighting &&
          <Field
            name="highlight.variable"
            component={ArchitectFields.Select}
            label="Highlight nodes with the following attribute:"
            placeholder="&mdash; Select a variable to highlight &mdash;"
            options={highlightVariablesForNodeType}
          />
        }
      </Section>
    </Guidance>
  );
};

HighlightFields.propTypes = {
  unusedHighlightVariablesForNodeType: PropTypes.array.isRequired,
  highlightVariablesForNodeType: PropTypes.array.isRequired,
  handleEdgeHighlightChange: PropTypes.func.isRequired,
  handleCreateVariable: PropTypes.func.isRequired,
  canCreateEdge: PropTypes.bool.isRequired,
  setCanCreateEdge: PropTypes.func.isRequired,
  allowHighlighting: PropTypes.bool,
};

HighlightFields.defaultProps = {
  allowHighlighting: false,
};

export { HighlightFields };

export default compose(
  withHighlightOptions,
  withEdgeHighlightChangeHandler,
  withCreateVariableHandlers,
)(HighlightFields);
