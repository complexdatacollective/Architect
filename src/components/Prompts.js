import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { arrayPush } from 'redux-form';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import cx from 'classnames';
import Guidance from './Guidance';
import OrderedList, { NewButton } from './OrderedList';
import ValidatedFieldArray from './Form/ValidatedFieldArray';
import { getFieldId } from '../utils/issues';

const notEmpty = value => (
  value && value.length > 0 ? undefined : 'You must create at least one prompt'
);

class Prompts extends PureComponent {
  render() {
    const {
      nodeType,
      form,
      disabled,
      addNewPrompt,
      fieldName,
      contentId,
      children,
      promptComponent: PromptComponent,
      ...rest
    } = this.props;

    return (
      <Guidance contentId={`${contentId}`}>
        <div className={cx('stage-editor-section', { 'stage-editor-section--disabled': disabled })}>
          <div id={getFieldId(`${fieldName}._error`)} data-name="Prompts" />
          {children}
          <div className="stage-editor-section-prompts">
            <div className="stage-editor-section-prompts__prompts">
              { nodeType &&
                <ValidatedFieldArray
                  name={fieldName}
                  component={OrderedList}
                  item={PromptComponent}
                  nodeType={nodeType}
                  form={form}
                  validation={{ notEmpty }}
                  {...rest}
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

Prompts.propTypes = {
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
  disabled: PropTypes.bool,
  addNewPrompt: PropTypes.func.isRequired,
  nodeType: PropTypes.string,
  fieldName: PropTypes.string,
  contentId: PropTypes.string,
  children: PropTypes.node,
  promptComponent: PropTypes.func.isRequired,
};

Prompts.defaultProps = {
  disabled: false,
  nodeType: null,
  fieldName: 'prompts',
  contentId: null,
  children: null,
};

const mapStateToProps = (state, props) => {
  const nodeType = get(props.form.getValues(state, 'subject'), 'type');

  return {
    disabled: !nodeType,
    nodeType,
  };
};

const mapDispatchToProps = (dispatch, { fieldName, form: { name } }) => ({
  addNewPrompt: bindActionCreators(
    () => arrayPush(name, fieldName, { id: uuid() }),
    dispatch,
  ),
});

export { Prompts };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Prompts);
