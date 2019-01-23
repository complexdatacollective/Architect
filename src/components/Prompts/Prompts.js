import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  compose,
  defaultProps,
  withState,
  withHandlers,
} from 'recompose';
import { Flipper } from 'react-flip-toolkit';
import {
  arrayPush,
  change,
  formValueSelector,
} from 'redux-form';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import cx from 'classnames';
import { getFieldId } from '../../utils/issues';
import Guidance from '../Guidance';
import OrderedList, { NewButton } from '../OrderedList';
import ValidatedFieldArray from '../Form/ValidatedFieldArray';
import PromptWindow from './PromptWindow';
import PromptForm from './PromptForm';

const notEmpty = value => (
  value && value.length > 0 ? undefined : 'You must create at least one prompt'
);

class Prompts extends PureComponent {
  render() {
    const {
      editField,
      handleEditField,
      handleResetEditField,
      handleUpdatePrompt,
      disabled,
      handleAddNewPrompt,
      fieldName,
      contentId,
      children,
      addNewPrompt,
      promptCount,
      setEditField,
      initialValues,
      editComponent: EditComponent,
      previewComponent: PreviewComponent,
      ...rest
    } = this.props;

    const stageEditorStyles = cx(
      'stage-editor-section',
      { 'stage-editor-section--disabled': disabled },
    );

    const isEditing = !!editField;

    return (
      <Guidance contentId={contentId}>
        <div className={stageEditorStyles}>
          <Flipper
            flipKey={isEditing}
            portalKey="prompts"
          >
            <div id={getFieldId(`${fieldName}._error`)} data-name="Prompts" />
            {children}
            <div className="stage-editor-section-prompts">
              <div className="stage-editor-section-prompts__prompts">
                <ValidatedFieldArray
                  name={fieldName}
                  component={OrderedList}
                  item={PreviewComponent}
                  validation={{ notEmpty }}
                  onClickPrompt={handleEditField}
                  editField={editField}
                  {...rest}
                />
              </div>
              <NewButton onClick={handleAddNewPrompt} />
            </div>
            <PromptWindow
              show={!!editField}
              editField={editField}
            >
              { editField &&
                <PromptForm
                  initialValues={initialValues}
                  onSubmit={handleUpdatePrompt}
                  onCancel={handleResetEditField}
                >
                  <EditComponent
                    fieldId={editField}
                    onComplete={handleResetEditField}
                    {...rest}
                  />
                </PromptForm>
              }
            </PromptWindow>
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
  fieldName: PropTypes.string.isRequired,
  contentId: PropTypes.string,
  children: PropTypes.node,
  previewComponent: PropTypes.any.isRequired,
  editComponent: PropTypes.any.isRequired,
};

Prompts.defaultProps = {
  disabled: false,
  contentId: null,
  children: null,
};

const mapStateToProps = (state, { form, fieldName, editField }) => {
  const prompts = formValueSelector(form.name)(state, fieldName);
  const promptCount = prompts ? prompts.length : 0;
  const initialValues = get({ prompts }, editField, {});

  return {
    initialValues,
    promptCount,
  };
};

const mapDispatchToProps = (dispatch, { fieldName, form: { name }, template = {} }) => {
  const addNewPrompt = () =>
    arrayPush(name, fieldName, { ...template, id: uuid() });

  return {
    addNewPrompt: bindActionCreators(addNewPrompt, dispatch),
    updatePrompt: (fieldId, value) => dispatch(change(name, fieldId, value)),
  };
};

const withFieldNameDefault = defaultProps({
  fieldName: 'prompts',
});

const withEditingState = withState('editField', 'setEditField', null);

const withPromptHandlers = compose(
  withHandlers({
    handleEditField: ({ setEditField }) => fieldId => setEditField(fieldId),
    handleResetEditField: ({ setEditField }) => () => setEditField(),
    handleAddNewPrompt: ({ addNewPrompt, setEditField, promptCount, fieldName }) => () => {
      addNewPrompt();
      setImmediate(() => {
        setEditField(`${fieldName}[${promptCount}]`);
      });
    },
    handleUpdatePrompt: ({ updatePrompt, setEditField, editField }) => (value) => {
      updatePrompt(editField, value);
      setImmediate(() => {
        setEditField();
      });
    },
  }),
);

export { Prompts };

export default compose(
  withFieldNameDefault,
  withEditingState,
  connect(mapStateToProps, mapDispatchToProps),
  withPromptHandlers,
)(Prompts);
