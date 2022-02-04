import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import TextField from '@codaco/ui/lib/components/Fields/Text';
import { getFieldId } from '@app/utils/issues';
import ValidatedField from '@components/Form/ValidatedField';
import EditableList from '@components/EditableList';
import withSubject from '@components/enhancers/withSubject';
import withDisabledSubjectRequired from '@components/enhancers/withDisabledSubjectRequired';
import withDisabledFormTitle from '@components/enhancers/withDisabledFormTitle';
import { Section } from '@components/EditorLayout';
import withFormHandlers from './withFormHandlers';
import FieldFields from './FieldFields';
import FieldPreview from './FieldPreview';
import { itemSelector, normalizeField } from './helpers';

const Form = ({
  handleChangeFields,
  form,
  disabled,
  type,
  entity,
  disableFormTitle,
}) => (
  <Section
    disabled={disabled}
    group
    title="Form"
    summary={(
      <>
        <div id={getFieldId('form.title')} data-name="Form title" />
        <p>
          Use this section to define the fields to collect when this form is shown.
        </p>
      </>
    )}
  >
    {!disableFormTitle
    && (
    <ValidatedField
      name="form.title"
      label="Form heading text (e.g 'Add a person')"
      component={TextField}
      placeholder="Enter your title here"
      className="stage-editor-section-title"
      validation={{ required: true }}
    />
    )}
    <EditableList
      editComponent={FieldFields}
      editProps={{
        type,
        entity,
      }}
      previewComponent={FieldPreview}
      fieldName="form.fields"
      title="Edit Field"
      onChange={handleChangeFields}
      normalize={normalizeField}
      itemSelector={itemSelector(entity, type)}
      form={form}
      sectionTitle="Fields"
      sectionSummary={(
        <>
          <div id={getFieldId('form.title')} data-name="Form fields" />
          <p>
            Add one or more fields to your form to collect attributes about each
            node the participant creates. Use the drag handle on the left of each
            prompt adjust its order.
          </p>
        </>
      )}
    />
  </Section>
);

Form.propTypes = {
  handleChangeFields: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  disableFormTitle: PropTypes.bool,
  type: PropTypes.string,
  entity: PropTypes.string,
};

Form.defaultProps = {
  disabled: false,
  disableFormTitle: false,
  type: null,
  entity: null,
};

export { Form };

export default compose(
  withSubject,
  withFormHandlers,
  withDisabledFormTitle,
  withDisabledSubjectRequired,
)(Form);
