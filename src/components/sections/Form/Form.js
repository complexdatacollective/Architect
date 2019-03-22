import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import Text from '../../../ui/components/Fields/Text';
import Guidance from '../../Guidance';
import ValidatedField from '../../Form/ValidatedField';
import EditableList, { withSubjectNodeType } from '../../EditableList';
import { getFieldId } from '../../../utils/issues';
import FieldFields from './FieldFields';
import FieldPreview from './FieldPreview';
import { getTypeForComponent } from './inputOptions';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';

const Form = ({ handleChangeFields, form }) => (
  <Guidance contentId="guidance.editor.form">
    <div className="stage-editor-section">
      <div id={getFieldId('form.title')} data-name="Form title" />
      <h2>Form</h2>

      <ValidatedField
        name="form.title"
        label="Form title"
        component={Text}
        placeholder="Enter your title here"
        className="stage-editor-section-title"
        validation={{ required: true }}
      />

      <EditableList
        contentId="guidance.editor.section.form"
        editComponent={FieldFields}
        previewComponent={FieldPreview}
        fieldName="form.fields"
        title="Edit Field"
        onChange={handleChangeFields}
        form={form}
      >
        <h4>Fields</h4>
        <p>
          Create fields for your form here
        </p>
      </EditableList>
    </div>
  </Guidance>
);

Form.propTypes = {
  handleChangeFields: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
};

const handlers = {
  handleChangeFields: ({ updateVariable, nodeType }) =>
    ({ id, component }) => {
      const type = getTypeForComponent(component);
      const configuration = { type };

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
