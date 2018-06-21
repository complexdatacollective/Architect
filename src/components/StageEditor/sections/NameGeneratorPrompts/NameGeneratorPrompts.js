import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { FieldArray, arrayPush } from 'redux-form';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import cx from 'classnames';
import Guidance from '../../../Guidance';
import RoundButton from '../../../Form/RoundButton';
import NameGeneratorPrompt from './NameGeneratorPrompt';
import Items from '../../Sortable/Items';

const fieldName = 'prompts';

const NameGeneratorPromptsSection = ({
  variableRegistry,
  form,
  disabled,
  addNewPrompt,
}) => (
  <Guidance contentId="guidance.editor.name_generator_prompts">
    <div className={cx('stage-editor-section', { 'stage-editor-section--disabled': disabled })}>
      <h2>Prompts</h2>
      <p>Name gen prompt specific</p>
      <div className="stage-editor-section-name-generator-prompts">
        <div className="stage-editor-section-name-generator-prompts__prompts">
          <FieldArray
            name={fieldName}
            component={Items}
            itemComponent={NameGeneratorPrompt}
            variableRegistry={variableRegistry}
            form={form}
          />
        </div>
        <div className="stage-editor-section-name-generator-prompts__add">
          <RoundButton type="button" onClick={addNewPrompt} content="+" />
        </div>
      </div>
    </div>
  </Guidance>
);

NameGeneratorPromptsSection.propTypes = {
  variableRegistry: PropTypes.object,
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
  disabled: PropTypes.bool,
  addNewPrompt: PropTypes.func.isRequired,
};

NameGeneratorPromptsSection.defaultProps = {
  variableRegistry: {},
  disabled: false,
};

const getVariablesForNodeType = (state, nodeType) => {
  const variableRegistry = get(state, 'protocol.present.variableRegistry', {});
  return get(variableRegistry, ['node', nodeType, 'variables'], {});
};

const mapStateToProps = (state, props) => {
  const nodeType = get(props.form.getValues(state, 'subject'), 'type');
  return {
    disabled: !nodeType,
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
