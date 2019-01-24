import React, { PureComponent } from 'react';
import {
  compose,
  defaultProps,
  withState,
} from 'recompose';
import { Flipper, Flipped } from 'react-flip-toolkit';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { getFieldId } from '../../utils/issues';
import Guidance from '../Guidance';
import OrderedList, { NewButton } from '../OrderedList';
import ValidatedFieldArray from '../Form/ValidatedFieldArray';
import PromptWindow from './PromptWindow';
import PromptForm from './PromptForm';
import withPromptHandlers from './withPromptHandlers';

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
      upsertPrompt,
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
              <Flipped flipId={null}>
                <NewButton onClick={handleAddNewPrompt} />
              </Flipped>
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

const withDefaultFieldName = defaultProps({
  fieldName: 'prompts',
});

const withEditingState = withState('editField', 'setEditField', null);

export { Prompts };

export default compose(
  withDefaultFieldName,
  withEditingState,
  withPromptHandlers,
)(Prompts);
