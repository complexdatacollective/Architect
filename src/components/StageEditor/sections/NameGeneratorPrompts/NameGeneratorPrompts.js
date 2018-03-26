import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { FieldArray } from 'redux-form';
import { has, get } from 'lodash';
import PropTypes from 'prop-types';
import { Section, Editor, Guidance } from '../../../Guided';
import NameGeneratorPrompt from './NameGeneratorPrompt';
import SortableItems from '../SortableItems';

const NameGeneratorPromptsSection = ({ variables, ...props }) => (
  <Section className="stage-editor-section" {...props}>
    <Editor className="stage-editor-section__edit">
      <h2>Prompts</h2>
      <p>Name gen prompt specific</p>
      <FieldArray
        name="prompts"
        component={SortableItems}
        itemComponent={NameGeneratorPrompt}
        variables={variables}
      />
    </Editor>
    <Guidance className="stage-editor-section__guidance">
      This is guidance for prompts.
    </Guidance>
  </Section>
);

NameGeneratorPromptsSection.propTypes = {
  variables: PropTypes.array,
};

NameGeneratorPromptsSection.defaultProps = {
  variables: [],
};

const mapStateToProps = (state, props) => {
  const variableRegistry = get(state, 'protocol.present.variableRegistry', {});
  const { type } = get(props, 'stage.subject', {});
  const variablesForNodeType = get(variableRegistry, ['node', type, 'variables'], {});

  return {
    show: has(props, 'stage.subject.type'),
    variables: variablesForNodeType,
  };
};

export { NameGeneratorPromptsSection };

export default compose(
  connect(mapStateToProps),
)(NameGeneratorPromptsSection);
