import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { FieldArray, arrayPush } from 'redux-form';
import { has, get } from 'lodash';
import PropTypes from 'prop-types';
import { Section, Editor, Guidance } from '../../../Guided';
import NameGeneratorPrompt from './NameGeneratorPrompt';
import SortableItems from '../SortableItems';


const addNewPrompt = () => arrayPush('edit-stage', 'prompts', {});

const NameGeneratorPromptsSection = ({ variableRegistry, ...props }) => (
  <Section className="stage-editor-section">
    <Editor className="stage-editor-section__edit">
      <h2>Prompts</h2>
      <p>Name gen prompt specific</p>
      <FieldArray
        name="prompts"
        component={SortableItems}
        itemComponent={NameGeneratorPrompt}
        variableRegistry={variableRegistry}
      />
      <button type="button" onClick={props.addNewPrompt}>+</button>
    </Editor>
    <Guidance className="stage-editor-section__guidance">
      This is guidance for prompts.
    </Guidance>
  </Section>
);

NameGeneratorPromptsSection.propTypes = {
  variableRegistry: PropTypes.object,
  addNewPrompt: PropTypes.func.isRequired,
};

NameGeneratorPromptsSection.defaultProps = {
  variableRegistry: {},
};

const mapStateToProps = (state, props) => {
  const variableRegistry = get(state, 'protocol.present.variableRegistry', {});
  const { type } = get(props, 'stage.subject', {});
  const variablesForNodeType = get(variableRegistry, ['node', type, 'variables'], {});

  return {
    show: has(props, 'stage.subject.type'),
    variableRegistry: variablesForNodeType,
  };
};

const mapDispatchToProps = dispatch => ({
  addNewPrompt: bindActionCreators(addNewPrompt, dispatch),
});

export { NameGeneratorPromptsSection };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(NameGeneratorPromptsSection);
