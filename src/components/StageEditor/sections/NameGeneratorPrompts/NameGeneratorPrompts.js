import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { FieldArray, arrayPush } from 'redux-form';
import { has, get } from 'lodash';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Section, Editor, Guidance } from '../../../Guided';
import RoundButton from '../../../Form/RoundButton';
import NameGeneratorPrompt from './NameGeneratorPrompt';
import SortableItems from '../../SortableItems';

const fieldName = 'prompts';

const NameGeneratorPromptsSection = ({
  variableRegistry,
  form,
  prompts,
  show,
  addNewPrompt,
  ...rest
}) => (
  <Section className="stage-editor-section" show={show} {...rest}>
    <Editor className="stage-editor-section__edit">
      <h2>Prompts</h2>
      <p>Name gen prompt specific</p>
      <div className="stage-editor-section-name-generator-prompts">
        <div className="stage-editor-section-name-generator-prompts__prompts">
          <FieldArray
            name={fieldName}
            component={SortableItems}
            itemComponent={NameGeneratorPrompt}
            variableRegistry={variableRegistry}
            form={form}
          />
        </div>
        <div className="stage-editor-section-name-generator-prompts__add">
          <RoundButton type="button" onClick={addNewPrompt} content="+" />
        </div>
      </div>
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
  show: PropTypes.bool,
  prompts: PropTypes.array.isRequired,
  addNewPrompt: PropTypes.func.isRequired,
};

NameGeneratorPromptsSection.defaultProps = {
  variableRegistry: {},
  show: false,
};

const getVariablesFormNodeType = (state, props) => {
  const variableRegistry = get(state, 'protocol.present.variableRegistry', {});
  const { type } = get(props, 'stage.subject', {});
  return get(variableRegistry, ['node', type, 'variables'], {});
};

const mapStateToProps = (state, props) => ({
  show: has(props.form.getValues(state, 'subject'), 'type'),
  variableRegistry: getVariablesFormNodeType(state, props),
  prompts: props.form.getValues(state, fieldName),
});

const mapDispatchToProps = (dispatch, { form: { name } }) => ({
  addNewPrompt: bindActionCreators(
    () => arrayPush(name, fieldName, { id: uuid() }),
    dispatch,
  ),
});

export { NameGeneratorPromptsSection };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(NameGeneratorPromptsSection);
