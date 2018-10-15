import React, { PureComponent } from 'react';
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

class NameGeneratorPromptsSection extends PureComponent {
  render() {
    const {
      nodeType,
      form,
      disabled,
      addNewPrompt,
    } = this.props;

    return (
      <Guidance contentId="guidance.editor.name_generator_prompts">
        <div className={cx('stage-editor-section', { 'stage-editor-section--disabled': disabled })}>
          <div id={getFieldId(`${fieldName}._error`)} data-name="Prompts" />
          <h2>Prompts</h2>
          <p>Name gen prompt specific</p>
          <div className="stage-editor-section-prompts">
            <div className="stage-editor-section-prompts__prompts">
              { nodeType &&
                <ValidatedFieldArray
                  name={fieldName}
                  component={Items}
                  itemComponent={NameGeneratorPrompt}
                  nodeType={nodeType}
                  form={form}
                  validation={{ notEmpty }}
                />
              }
            </div>
            <NewButton onClick={addNewPrompt} />
          </div>
        </div>
      </Guidance>
    );
  }
}

NameGeneratorPromptsSection.propTypes = {
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
  disabled: PropTypes.bool,
  addNewPrompt: PropTypes.func.isRequired,
  nodeType: PropTypes.string,
};

NameGeneratorPromptsSection.defaultProps = {
  disabled: false,
  nodeType: null,
};

const mapStateToProps = (state, props) => {
  const nodeType = get(props.form.getValues(state, 'subject'), 'type');
  return {
    disabled: !nodeType,
    nodeType,
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
