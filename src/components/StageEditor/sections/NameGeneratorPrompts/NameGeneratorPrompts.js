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


const NameGeneratorPromptsSection = ({ variableRegistry, form, ...props }) => (
  <Section className="stage-editor-section">
    <Editor className="stage-editor-section__edit">
      <h2>Prompts</h2>
      <p>Name gen prompt specific</p>
      <FieldArray
        name="prompts"
        component={SortableItems}
        itemComponent={NameGeneratorPrompt}
        variableRegistry={variableRegistry}
        form={form}
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
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
  addNewPrompt: PropTypes.func.isRequired,
};

NameGeneratorPromptsSection.defaultProps = {
  variableRegistry: {},
};

const getVariablesFormNodeType = (state, props) => {
  const variableRegistry = get(state, 'protocol.present.variableRegistry', {});
  const { type } = get(props, 'stage.subject', {});
  return get(variableRegistry, ['node', type, 'variables'], {});
};

const mapStateToProps = (state, props) => ({
  show: has(props, 'stage.subject.type'),
  variableRegistry: getVariablesFormNodeType(state, props),
});

const mapDispatchToProps = (dispatch, { form: { name } }) => ({
  addNewPrompt: bindActionCreators(
    () => arrayPush(name, 'prompts', {}),
    dispatch,
  ),
});

export { NameGeneratorPromptsSection };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(NameGeneratorPromptsSection);
