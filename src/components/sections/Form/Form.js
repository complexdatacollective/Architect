import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import uuid from 'uuid';
import { omit } from 'lodash';
import TextField from '../../../ui/components/Fields/Text';
import Guidance from '../../Guidance';
import ValidatedField from '../../Form/ValidatedField';
import EditableList, { withSubjectNodeType } from '../../EditableList';
import { getFieldId } from '../../../utils/issues';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';
import Section from '../Section';
import FieldFields from './FieldFields';
import FieldPreview from './FieldPreview';
import { getTypeForComponent } from './inputOptions';

const template = () => ({ variable: uuid() });

const normalizeField = field =>
  omit(field, ['id', 'name']);

const Form = ({ handleChangeFields, form, disabled }) => (
    <Section disabled={disabled}>
  <Guidance contentId="guidance.section.form">
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
        form={form}
      >
        <h4>Fields</h4>
        <p>
          Create fields for your form here
        </p>
      </EditableList>
    </Section>
  </Guidance>
);

Form.propTypes = {
  handleChangeFields: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

Form.defaultProps = {
  disabled: false,
};

const handlers = {
  handleChangeFields: ({ updateVariable, nodeType }) =>
    ({ id, component, name }) => {
      const type = getTypeForComponent(component);
      const configuration = { type, name };

      updateVariable(
        'node',
        nodeType,
        id,
        configuration,
      );
    },
};

const mapDispatchToProps = {
  updateVariable: codebookActions.updateVariable,
};

export { Form };

export default compose(
  withSubjectNodeType,
  connect(null, mapDispatchToProps),
  withHandlers(handlers),
)(Form);
