import React from 'react';
import {
  compose,
  defaultProps,
  withState,
} from 'recompose';
import PropTypes from 'prop-types';
import { Button } from '@codaco/ui/lib/components';
import { Section } from '@components/EditorLayout';
import InlineEditScreen from '@components/InlineEditScreen';
import { scrollToFirstIssue } from '../../utils/issues';
import ValidatedFieldArray from '../Form/ValidatedFieldArray';
import Grid from './Grid';
import withEditHandlers from './withEditHandlers';

const formName = 'editable-list-form';

const notEmpty = (value) => (
  value && value.length > 0 ? undefined : 'You must create at least one item'
);

const handleSubmitFail = (issues) => {
  scrollToFirstIssue(issues);
};

const GridManager = ({
  editField,
  disabled,
  contentId,
  children,
  validation,
  handleEditField,
  handleAddNew,
  handleUpdate,
  handleResetEditField,
  hasSpace,
  title,
  fieldName,
  capacity,
  initialValues,
  editComponent: EditComponent,
  previewComponent,
  itemCount,
  itemSelector,
  items,
  normalize,
  setEditField,
  template,
  upsert,
  ...rest
}) => (
  <Section
    title="Items"
    summary={(
      <p>
        Add up to four content blocks (depending on size) below.
        You can resize a content block by dragging the bottom right corner.
      </p>
    )}
    disabled={disabled}
    contentId={contentId}
    id={fieldName}
  >
    {children}
    <div className="grid-manager">
      <div className="grid-manager__items">
        <ValidatedFieldArray
          name={fieldName}
          component={Grid}
          previewComponent={previewComponent}
          validation={validation}
          onEditItem={handleEditField}
          editField={editField}
          capacity={capacity}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
        />
      </div>
      { hasSpace
        && (
        <div className="grid-manager__add">
          <Button onClick={handleAddNew} size="small" icon="add">
            Add new item
          </Button>
        </div>
        )}
    </div>
    <InlineEditScreen
      show={!!editField}
      initialValues={initialValues}
      flipId={editField}
      title={title}
      onSubmit={handleUpdate}
      onSubmitFail={handleSubmitFail}
      onCancel={handleResetEditField}
      form={formName}
    >
      <EditComponent
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
        form={formName}
        fieldId={editField}
        onComplete={handleResetEditField}
      />
    </InlineEditScreen>
  </Section>
);

GridManager.propTypes = {
  form: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
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
  handleAddNew: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleResetEditField: PropTypes.func.isRequired,
  hasSpace: PropTypes.bool.isRequired,
  capacity: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  initialValues: PropTypes.any,
  itemCount: PropTypes.number.isRequired,
  itemSelector: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  items: PropTypes.array.isRequired,
  normalize: PropTypes.func.isRequired,
  setEditField: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  template: PropTypes.any,
  upsert: PropTypes.func.isRequired,
};

GridManager.defaultProps = {
  disabled: false,
  contentId: null,
  children: null,
  title: null,
  validation: { notEmpty },
  initialValues: null,
  template: null,
  editField: null,
};

const withDefaultFieldName = defaultProps({
  fieldName: 'items',
});

const withEditingState = withState('editField', 'setEditField', null);

export { GridManager };

export default compose(
  withDefaultFieldName,
  withEditingState,
  withEditHandlers,
)(GridManager);
