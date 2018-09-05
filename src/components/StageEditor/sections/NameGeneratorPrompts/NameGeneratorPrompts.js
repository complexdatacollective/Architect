import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { arrayPush } from 'redux-form';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import cx from 'classnames';
import Guidance from '../../../Guidance';
import NameGeneratorPrompt from './NameGeneratorPrompt';
import { Items, NewButton } from '../../../Items';
import ValidatedFieldArray from '../../../Form/ValidatedFieldArray';
import { getFieldId } from '../../../../utils/issues';

const fieldName = 'prompts';

const notEmpty = value => (
  value && value.length > 0 ? undefined : 'You must create at least one prompt'
);

const NameGeneratorPromptsSection = ({
  variableRegistry,
  form,
  disabled,
  addNewPrompt,
}) => (
  <Guidance contentId="guidance.editor.name_generator_prompts">
    <div className={cx('stage-editor-section', { 'stage-editor-section--disabled': disabled })}>
      <div id={getFieldId(`${fieldName}._error`)} data-name="Prompts" />
      <h2>Prompts</h2>
      <p>Name gen prompt specific</p>
      <div className="stage-editor-section-prompts">
        <div className="stage-editor-section-prompts__prompts">
          <ValidatedFieldArray
            name={fieldName}
            component={Items}
            itemComponent={NameGeneratorPrompt}
            variableRegistry={variableRegistry}
            form={form}
            validation={{ notEmpty }}
          />
        </div>
        <NewButton onClick={addNewPrompt} />
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
