import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { compose } from 'recompose';
import * as ArchitectFields from '../../Form/Fields';
import * as Fields from '../../../ui/components/Fields';
import Row from '../Row';
import Section from '../Section';
import withCreateVariableHandlers from '../../enhancers/withCreateVariableHandler';
import withHighlightOptions from './withHighlightOptions';
import withEdgeHighlightChangeHandler from './withEdgeHighlightChangeHandler';

const HighlightFields = ({
  allowHighlighting,
  highlightVariablesForSubject,
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
    <Section contentId="guidance.editor.sociogram_prompt.attributes" group>
      <h3>Attributes</h3>
      <p>
        Use this section to configure node highlighting. The particiant
        will be able to toggle this attribute by simply tapping (or
        clicking) a node.
      </p>
      <Field
        component={Fields.Toggle}
        name="highlight.allowHighlighting"
        onChange={handleChangeAllowHighlighting}
        label="Toggle attribute by tapping on a node?"
        disabled={canCreateEdge}
        title={canCreateEdge && 'Create edge must be disabled to allow highlighting'}
      />
      <Row disabled={!allowHighlighting}>
        <Field
          name="highlight.variable"
          component={ArchitectFields.CreatableSelect}
          label="Toggle the following boolean variable"
          onCreateOption={value => handleCreateVariable(value, 'boolean')}
          placeholder="&mdash; Select a variable to toggle, or type a name to create a new one &mdash;"
          options={highlightVariablesForSubject}
          formatCreateLabel={inputValue => (
            <span>
              Press enter to create a new boolean variable named &quot;{inputValue}&quot;.
            </span>
          )}
        />
      </Row>
    </Section>
  );
};

HighlightFields.propTypes = {
  highlightVariablesForSubject: PropTypes.array.isRequired,
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
