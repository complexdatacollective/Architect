import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Text from '../../../ui/components/Fields/Text';
import Guidance from '../../Guidance';
import ValidatedField from '../../Form/ValidatedField';
import EditableList from '../../EditableList';
import { getFieldId } from '../../../utils/issues';
import FieldFields from './FieldFields';
import FieldPreview from './FieldPreview';

const Form = (props) => {
  return (
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
          {...props}
        >
          <h4>Fields</h4>
          <p>
            Create fields for your form here
          </p>
        </EditableList>
      </div>
    </Guidance>
  );
}

Form.propTypes = {
};

Form.defaultProps = {
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export { Form };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Form);
