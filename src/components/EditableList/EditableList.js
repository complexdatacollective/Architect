import React, { useMemo } from 'react';
import {
  compose,
  defaultProps,
} from 'recompose';
import { motion, AnimateSharedLayout } from 'framer-motion';
import PropTypes from 'prop-types';
import { startCase } from 'lodash';
import { Button } from '@codaco/ui';
import { Section } from '@components/EditorLayout';
import InlineEditScreen from '@components/InlineEditScreen';
import { getFieldId, scrollToFirstIssue } from '../../utils/issues';
import OrderedList from '../OrderedList';
import UnorderedList from '../UnorderedList';
import ValidatedFieldArray from '../Form/ValidatedFieldArray';
import withEditHandlers from './withEditHandlers';

const formName = 'editable-list-form';

const sortModes = [
  'auto',
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
}) => {
  const ListComponent = useMemo(() => (sortMode !== 'manual' ? UnorderedList : OrderedList), [sortMode]);

  return (
    <Section disabled={disabled} contentId={contentId}>
      <AnimateSharedLayout>
        <div id={getFieldId(`${fieldName}._error`)} data-name={startCase(fieldName)} />
        {children}
        <div className="editable-list">
          <div className="editable-list__items">
            <ValidatedFieldArray
              name={fieldName}
              component={ListComponent}
              item={PreviewComponent}
              // validation={validation}
              onClickPrompt={handleEditField}
              editField={editField}
              form={formName}
              // eslint-disable-next-line react/jsx-props-no-spreading
              // {...rest}
            />
          </div>
          <motion.div layoutId="new">
            <Button onClick={handleAddNew} size="small" icon="add">Create new</Button>
          </motion.div>
        </div>
        <InlineEditScreen
          show={!!editField}
          initialValues={initialValues}
          layoutId={editField}
          title={title}
          onSubmit={handleUpdate}
          onSubmitFail={handleSubmitFail}
          onCancel={handleCancelEditField}
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
};

EditableList.propTypes = {
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
