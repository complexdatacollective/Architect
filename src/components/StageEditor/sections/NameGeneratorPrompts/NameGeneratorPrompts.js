import React, { Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { FieldArray, arrayPush } from 'redux-form';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import uuid from 'uuid';
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
  <Fragment>
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
  </Fragment>
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

NameGeneratorPromptsSection.Guidance = (
  <Fragment className="stage-editor-section__guidance">
    <p>
      {'Prompts allow you to specify one or more specific questions to post to the participant, in order to encourage the recall of nodes. '}
    </p>
    <p>
      {'Prompts should be carefully considered, and grounded in existing literature wherever possible. Think carefully about if you want to use one name generator with muiltiple prompts, or many name generators with a single prompt. Your choice depends on your specific research goals, and the needs of your research population.'}
    </p>
    <p>
      {'Each prompt can optionally assign a value to one or more node variables. You can use this functionality to keep track of where a node was created, or to assign an attribute to a node based on the prompt (such as indicating a node is a potential family member, if elicited in a prompt about family).'}
    </p>
  </Fragment>
);

const getVariablesForNodeType = (state, nodeType) => {
  const variableRegistry = get(state, 'protocol.present.variableRegistry', {});
  return get(variableRegistry, ['node', nodeType, 'variables'], {});
};

const mapStateToProps = (state, props) => {
  const nodeType = get(props.form.getValues(state, 'subject'), 'type');
  return {
    show: !!nodeType,
    variableRegistry: getVariablesForNodeType(state, nodeType),
    prompts: props.form.getValues(state, fieldName),
  };
};

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
