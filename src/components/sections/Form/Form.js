import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import TextField from '../../../ui/components/Fields/Text';
import ValidatedField from '../../Form/ValidatedField';
import EditableList from '../../EditableList';
import { getFieldId } from '../../../utils/issues';
import Section from '../Section';
import FieldFields from './FieldFields';
import FieldPreview from './FieldPreview';
import withFieldChangeHandlers from './withFieldChangeHandlers';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import withDisabledFormTitle from '../../enhancers/withDisabledFormTitle';
import { itemSelector, normalizeField } from './helpers';

const Form = ({
  handleChangeFields,
  form,
  disabled,
  type,
  entity,
  existingVariableNames,
  disableFormTitle,
}) => (
  <Section disabled={disabled} group contentId="guidance.section.form">
    <div id={getFieldId('form.title')} data-name="Form title" />
    <h2>Form</h2>
    <p>
      Use this section to define the fields to collect when this form is shown.
    </p>
    {!disableFormTitle &&
    <ValidatedField
      name="form.title"
      label="Form heading text (e.g 'Add a person')"
      component={TextField}
      placeholder="Enter your title here"
      className="stage-editor-section-title"
      validation={{ required: true }}
    />
    }
    <EditableList
      editComponent={FieldFields}
      editProps={{
        type,
        entity,
        existingVariableNames,
      }}
      previewComponent={FieldPreview}
      fieldName="form.fields"
      title="Edit Field"
      onChange={handleChangeFields}
      normalize={normalizeField}
      itemSelector={itemSelector(entity, type)}
      form={form}
    >
      <h4>Fields</h4>
      <p>
        Add one or more fields to your form to collect attributes about each
        node the participant creates.
      </p>
      <p>
        Use the drag handle on the left of each prompt adjust its order.
      </p>
    </EditableList>
  </Section>
);

Form.propTypes = {
  handleChangeFields: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  disableFormTitle: PropTypes.bool,
  type: PropTypes.string,
  entity: PropTypes.string,
  existingVariableNames: PropTypes.array.isRequired,
};

Form.defaultProps = {
  disabled: false,
  disableFormTitle: false,
  type: null,
  entity: null,
};

export { Form };

export default compose(
  withFieldChangeHandlers,
  withDisabledFormTitle,
  withDisabledSubjectRequired,
)(Form);
