import React from 'react';
import { compose, defaultProps } from 'recompose';
import PropTypes from 'prop-types';
import { startCase } from 'lodash';
import { AnimateSharedLayout } from 'framer-motion';
import { Button } from '@codaco/ui';
import { getFieldId, scrollToFirstIssue } from '@app/utils/issues';
import { Section } from '@components/EditorLayout';
import InlineEditScreen from '@components/InlineEditScreen';
import OrderedList from '@components/OrderedList';
import ValidatedField from '@components/Form/ValidatedField';
import withEditHandlers from './withEditHandlers';

const formName = 'editable-list-form';

const sortModes = [
  'manual',
];

const notEmpty = (value) => (
  value && value.length > 0 ? undefined : 'You must create at least one item.'
);

const handleSubmitFail = (issues) => {
  scrollToFirstIssue(issues);
};

const withDefaultFieldName = defaultProps({
  fieldName: 'prompts',
});

const EditableList = ({
  sectionTitle,
  sectionSummary,
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
}) => (
  <Section disabled={disabled} contentId={contentId} summary={sectionSummary} title={sectionTitle}>
    <AnimateSharedLayout>
      <div id={getFieldId(`${fieldName}._error`)} data-name={startCase(fieldName)} />
      {children}
      <div className="editable-list">
        <div className="editable-list__items">
          <ValidatedField
            name={fieldName}
            component={OrderedList}
            item={PreviewComponent}
            validation={validation}
            onClickItem={handleEditField}
            editField={editField}
            form={formName}
            // eslint-disable-next-line react/jsx-props-no-spreading
            // {...rest}
          />
        </div>
        <Button onClick={handleAddNew} size="small" icon="add">Create new</Button>
      </div>

      <InlineEditScreen
        show={!!editField}
        initialValues={initialValues}
        title={title}
        onSubmit={handleUpdate}
        onSubmitFail={handleSubmitFail}
        onCancel={handleCancelEditField}
        layoutId={editField}
        form={formName}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...editProps}
      >
        <EditComponent
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...editProps}
          form={formName}
          initialValues={initialValues}
          fieldId={editField}
        />
      </InlineEditScreen>
    </AnimateSharedLayout>
  </Section>
);

EditableList.propTypes = {
  sectionTitle: PropTypes.string.isRequired,
  sectionSummary: PropTypes.node,
  form: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  sortMode: PropTypes.oneOf(sortModes),
  fieldName: PropTypes.string.isRequired,
  contentId: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  // eslint-disable-next-line react/forbid-prop-types
  previewComponent: PropTypes.any.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  editComponent: PropTypes.any.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  validation: PropTypes.object,
  editField: PropTypes.string,
  handleEditField: PropTypes.func.isRequired,
  handleCancelEditField: PropTypes.func.isRequired,
  handleCompleteEditField: PropTypes.func,
  handleUpdate: PropTypes.func.isRequired,
  handleAddNew: PropTypes.func.isRequired,
  upsert: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  itemCount: PropTypes.any.isRequired,
  setEditField: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  initialValues: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  editProps: PropTypes.any,
};

EditableList.defaultProps = {
  disabled: false,
  sectionSummary: null,
  contentId: null,
  children: null,
  title: null,
  sortMode: 'manual',
  validation: { notEmpty },
  initialValues: null,
  handleCompleteEditField: () => {},
  editProps: null,
  editField: null,
};

export { EditableList };

export default compose(
  withDefaultFieldName,
  withEditHandlers,
)(EditableList);
