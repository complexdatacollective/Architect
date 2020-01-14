import React, { PureComponent } from 'react';
import {
  compose,
  defaultProps,
} from 'recompose';
import { Flipper, Flipped } from 'react-flip-toolkit';
import PropTypes from 'prop-types';
import { startCase } from 'lodash';
import { Button } from '@codaco/ui';
import { getFieldId, scrollToFirstIssue } from '../../utils/issues';
import OrderedList from '../OrderedList';
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

const withDefaultFieldName = defaultProps({
  fieldName: 'prompts',
});

class EditableList extends PureComponent {
  render() {
    const {
      editField,
      handleEditField,
      handleCancelEditField,
      handleCompleteEditField,
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
      editProps,
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
          <div id={getFieldId(`${fieldName}._error`)} data-name={startCase(fieldName)} />
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
                form={formName}
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
              onCancel={handleCancelEditField}
              form={formName}
              {...editProps}
            >
              <EditComponent
                {...rest}
                {...editProps}
                form={formName}
                fieldId={editField}
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

export { EditableList };

export default compose(
  withDefaultFieldName,
  withEditHandlers,
)(EditableList);
