import React, { PureComponent } from 'react';
import {
  compose,
  defaultProps,
  withState,
} from 'recompose';
import { Flipper, Flipped } from 'react-flip-toolkit';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { getFieldId, scrollToFirstIssue } from '../../utils/issues';
import Guidance from '../Guidance';
import OrderedList, { NewButton } from '../OrderedList';
import ValidatedFieldArray from '../Form/ValidatedFieldArray';
import Window from './Window';
import Form from './Form';
import withEditHandlers from './withEditHandlers';

const notEmpty = value => (
  value && value.length > 0 ? undefined : 'You must create at least one prompt'
);

const handleSubmitFail = (issues) => {
  scrollToFirstIssue(issues);
};

class EditableList extends PureComponent {
  render() {
    const {
      editField,
      handleEditField,
      handleResetEditField,
      handleUpdate,
      disabled,
      handleAddNew,
      fieldName,
      contentId,
      children,
      upsert,
      title,
      itemCount,
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
            <div id={getFieldId(`${fieldName}._error`)} data-name={fieldName} />
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
                <NewButton onClick={handleAddNew} />
              </Flipped>
            </div>
            <Window show={!!editField}>
              <Form
                initialValues={initialValues}
                flipId={editField}
                title={title}
                onSubmit={handleUpdate}
                onSubmitFail={handleSubmitFail}
                onCancel={handleResetEditField}
              >
                <EditComponent
                  fieldId={editField}
                  onComplete={handleResetEditField}
                  {...rest}
                />
              </Form>
            </Window>
          </Flipper>
        </div>
      </Guidance>
    );
  }
}

EditableList.propTypes = {
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
  disabled: PropTypes.bool,
  fieldName: PropTypes.string.isRequired,
  contentId: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  previewComponent: PropTypes.any.isRequired,
  editComponent: PropTypes.any.isRequired,
};

EditableList.defaultProps = {
  disabled: false,
  contentId: null,
  children: null,
  title: null,
};

const withDefaultFieldName = defaultProps({
  fieldName: 'prompts',
});

const withEditingState = withState('editField', 'setEditField', null);

export { EditableList };

export default compose(
  withDefaultFieldName,
  withEditingState,
  withEditHandlers,
)(EditableList);