/* eslint-disable */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { FieldArray, arrayPush } from 'redux-form';
import { has, get, toPath } from 'lodash';
import PropTypes from 'prop-types';
import { Section, Editor, Guidance } from '../../../Guided';
import NameGeneratorPrompt from './NameGeneratorPrompt';
import SortableItems from '../SortableItems';

const fieldName = 'prompts';

const getId = (prompts, fieldName) => {
  const path = toPath(fieldName).slice(1);
  console.log('ID', get(prompts, [ ...path, 'id' ]))
  return get(prompts, [ ...path, 'id' ]);
};

const NameGeneratorPromptsSection = ({ variableRegistry, form, prompts, ...props }) => (
  <Section className="stage-editor-section">
    <Editor className="stage-editor-section__edit">
      <h2>Prompts</h2>
      <p>Name gen prompt specific</p>
      <FieldArray
        name={fieldName}
        component={SortableItems}
        itemComponent={NameGeneratorPrompt}
        variableRegistry={variableRegistry}
        getId={(fieldName) => getId(prompts, fieldName)}
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
  prompts: PropTypes.array.isRequired,
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
  prompts: props.form.getValues(state, fieldName),
})

const mapDispatchToProps = (dispatch, { form: { name } }) => ({
  addNewPrompt: bindActionCreators(
    () => arrayPush(name, fieldName, {}),
    dispatch,
  ),
});

export { NameGeneratorPromptsSection };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(NameGeneratorPromptsSection);
