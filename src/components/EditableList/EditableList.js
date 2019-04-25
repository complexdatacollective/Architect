import React, { PureComponent } from 'react';
import {
  compose,
  defaultProps,
  withState,
} from 'recompose';
import { Flipper, Flipped } from 'react-flip-toolkit';
import PropTypes from 'prop-types';
import { getFieldId, scrollToFirstIssue } from '../../utils/issues';
import OrderedList from '../OrderedList';
import { Button } from '../../ui/';
import UnorderedList from '../UnorderedList';
import ValidatedFieldArray from '../Form/ValidatedFieldArray';
import Section from '../sections/Section'; // Should this exist out of sections if it's used here?
import Window from '../Window';
import Form from '../Form';
import withEditHandlers from './withEditHandlers';

const formName = 'editiable-list-form';

const sortModes = [
  'auto',
  'manual',
];

const notEmpty = value => (
  value && value.length > 0 ? undefined : 'You must create at least one item'
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
      sortMode,
      handleAddNew,
      fieldName,
      contentId,
      children,
      upsert,
      title,
      validation,
      itemCount,
      setEditField,
      initialValues,
      editComponent: EditComponent,
      previewComponent: PreviewComponent,
      ...rest
    } = this.props;

    const isEditing = !!editField;

    const ListComponent = sortMode !== 'manual' ? UnorderedList : OrderedList;

    return (
      <Section disabled={disabled} contentId={contentId}>
        <Flipper
          flipKey={isEditing}
          portalKey="editable-list"
        >
          <div id={getFieldId(`${fieldName}._error`)} data-name={fieldName} />
          {children}
          <div className="editable-list">
            <div className="editable-list__items">
              <ValidatedFieldArray
                name={fieldName}
                component={ListComponent}
                item={PreviewComponent}
                validation={validation}
                onClickPrompt={handleEditField}
                editField={editField}
                {...rest}
              />
            </div>
            <Flipped flipId={null}>
              <Button onClick={handleAddNew} size="small" icon="add">Create new</Button>
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
              form={formName}
            >
              <EditComponent
                {...rest}
                form={formName}
                fieldId={editField}
                onComplete={handleResetEditField}
              />
            </Form>
          </Window>
        </Flipper>
      </Section>
    );
  }
}

EditableList.propTypes = {
  form: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  sortMode: PropTypes.oneOf(sortModes),
  fieldName: PropTypes.string.isRequired,
  contentId: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  previewComponent: PropTypes.any.isRequired,
  editComponent: PropTypes.any.isRequired,
  validation: PropTypes.object,
};

EditableList.defaultProps = {
  disabled: false,
  contentId: null,
  children: null,
  title: null,
  sortMode: 'manual',
  validation: { notEmpty },
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
