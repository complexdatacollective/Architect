import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  compose,
  defaultProps,
  withState,
} from 'recompose';
import {
  Flipper,
  Flipped,
} from 'react-flip-toolkit';
import { arrayPush } from 'redux-form';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import cx from 'classnames';
import Guidance from './Guidance';
import OrderedList, { NewButton } from './OrderedList';
import ValidatedFieldArray from './Form/ValidatedFieldArray';
import { getFieldId } from '../utils/issues';
import window from '../ui/components/window';
import Fade from '../ui/components/Transitions/Fade';

const Modal = window(
  ({
    show,
    children,
    handleBlur,
  }) => (
    <Fade in={!!show}>
      <div className={cx('modal', { 'modal--show': !!show })}>
        <div className="modal__background" />
        <div className="modal__content" onClick={handleBlur} >
    <Flipped flipId={show}>
          <div style={{ padding: '100px', width: '90vw', height: '70vh', backgroundColor: 'silver', borderRadius: '20px' }}>
            {children}
          </div>
    </Flipped>
        </div>
      </div>
    </Fade>
  ),
);

const notEmpty = value => (
  value && value.length > 0 ? undefined : 'You must create at least one prompt'
);

class Prompts extends PureComponent {
  render() {
    const {
      isEditing,
      setIsEditing,
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
          <Flipper
            flipKey={!!isEditing}
            portalKey="prompts"
          >
            <div id={getFieldId(`${fieldName}._error`)} data-name="Prompts" />
            {children}
            <div className="stage-editor-section-prompts">
              <div className="stage-editor-section-prompts__prompts">
                { nodeType &&
                  <ValidatedFieldArray
                    name={fieldName}
                    component={OrderedList}
                    onClickPrompt={(id) => setIsEditing(id)}
                    isEditing={isEditing}
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
            <Modal show={isEditing} handleBlur={() => setIsEditing(null)}>
              hello world
            </Modal>
          </Flipper>
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
  fieldName: PropTypes.string.isRequired,
  contentId: PropTypes.string,
  children: PropTypes.node,
  promptComponent: PropTypes.func.isRequired,
};

Prompts.defaultProps = {
  disabled: false,
  nodeType: null,
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

const mapDispatchToProps = (dispatch, { fieldName, form: { name }, template = {} }) => ({
  addNewPrompt: bindActionCreators(
    () => arrayPush(name, fieldName, { ...template, id: uuid() }),
    dispatch,
  ),
});

const withFieldNameDefault = defaultProps({
  fieldName: 'prompts',
});

const withEditingState = withState('isEditing', 'setIsEditing', false);

export { Prompts };

export default compose(
  withFieldNameDefault,
  withEditingState,
  connect(mapStateToProps, mapDispatchToProps),
)(Prompts);
