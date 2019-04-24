import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import uuid from 'uuid';
import TextField from '../../../ui/components/Fields/Text';
import ValidatedField from '../../Form/ValidatedField';
import EditableList from '../../EditableList';
import { getFieldId } from '../../../utils/issues';
import Section from '../Section';
import FieldFields from './FieldFields';
import FieldPreview from './FieldPreview';
import withFieldChangeHandlers from './withFieldChangeHandlers';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import { itemSelector, normalizeField } from './helpers';

const template = () => ({ variable: uuid() });

const Form = ({
  handleChangeFields,
  form,
  disabled,
  type,
  entity,
}) => (
  <Section disabled={disabled} group contentId="guidance.section.form">
    <div id={getFieldId('form.title')} data-name="Form title" />
    <h2>Form</h2>

    <ValidatedField
      name="form.title"
      label="Form title"
      component={TextField}
      placeholder="Enter your title here"
      className="stage-editor-section-title"
      validation={{ required: true }}
    />

    <EditableList
      editComponent={FieldFields}
      previewComponent={FieldPreview}
      fieldName="form.fields"
      title="Edit Field"
      onChange={handleChangeFields}
      template={template}
      normalize={normalizeField}
      itemSelector={itemSelector(entity, type)}
      form={form}
    >
      <h4>Fields</h4>
      <p>
        Create fields for your form here
      </p>
    </EditableList>
  </Section>
);

Form.propTypes = {
  handleChangeFields: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  entity: PropTypes.string,
};

Form.defaultProps = {
  disabled: false,
  type: null,
  entity: null,
};

export { Form };

export default compose(
  withFieldChangeHandlers,
  withDisabledSubjectRequired,
)(Form);
