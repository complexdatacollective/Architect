import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { compose, withHandlers } from 'recompose';
import uuid from 'uuid';
import { omit, get, reduce } from 'lodash';
import TextField from '../../../ui/components/Fields/Text';
import Guidance from '../../Guidance';
import ValidatedField from '../../Form/ValidatedField';
import EditableList, { withSubjectNodeType } from '../../EditableList';
import { getFieldId } from '../../../utils/issues';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';
import Section from '../Section';
import FieldFields from './FieldFields';
import FieldPreview from './FieldPreview';
import { getTypeForComponent } from '../../Form/inputOptions';
import { getCodebook } from '../../../selectors/protocol';

const template = () => ({ variable: uuid() });

const CODEBOOK_PROPERTIES = ['name', 'options'];

const getCodebookProperties = properties =>
  reduce(
    CODEBOOK_PROPERTIES,
    (memo, key) => {
      const property = properties[key];
      if (!property) { return memo; }
      return {
        ...memo,
        [key]: property,
      };
    },
    {},
  );

const normalizeField = field =>
  omit(field, ['id', ...CODEBOOK_PROPERTIES]);

// Merge item with variable info from codebook
const itemSelector = nodeType =>
  (state, { form, editField }) => {
    const item = formValueSelector(form)(state, editField);

    if (!item) { return null; }

    const codebook = getCodebook(state);
    const variable = item && item.variable;
    const codebookConfiguration = get(codebook, ['node', nodeType, 'variables', variable], {});
    const codebookProperties = getCodebookProperties(codebookConfiguration);

    return {
      ...item,
      ...codebookProperties,
    };
  };

const Form = ({ handleChangeFields, form, disabled, nodeType }) => (
  <Guidance contentId="guidance.section.form">
    <Section disabled={disabled} group>
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
        itemSelector={itemSelector(nodeType)}
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
  nodeType: PropTypes.string,
};

Form.defaultProps = {
  disabled: false,
  nodeType: null,
};

const handlers = {
  handleChangeFields: ({ updateVariable, nodeType }) =>
    ({ variable, component, ...rest }) => {
      const type = getTypeForComponent(component);
      const codebookProperties = getCodebookProperties(rest);
      const configuration = { type, ...codebookProperties };

      updateVariable(
        'node',
        nodeType,
        variable,
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
