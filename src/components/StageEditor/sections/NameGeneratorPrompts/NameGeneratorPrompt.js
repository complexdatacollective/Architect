import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import { get, reduce, isEmpty } from 'lodash';
import { compose, withHandlers } from 'recompose';
import { ValidatedField } from '../../../Form';
import TextArea from '../../../../ui/components/Fields/TextArea';
import AttributesTable from './AttributesTable';
import { Item } from '../../../Items';
import { getFieldId } from '../../../../utils/issues';
import { getValidations } from '../../../../utils/validations';

const withValidation = withHandlers({
  handleValidateAttributes: props => (attributes) => {
    const variables = get(props.variableRegistry, ['node', props.nodeType, 'variables'], {});
    const allErrors = reduce(attributes, (errors, attribute, variable) => {
      const variableMeta = get(variables, variable, {});
      const validations = getValidations(get(variableMeta, 'validation', {}));
      const result = validations.reduce(
        (error, validate) => error || validate(attribute),
        undefined,
      );

      if (!result) { return errors; }

      return {
        ...errors,
        // variableMeta.name?
        [variable]: validations.reduce(
          (error, validate) => error || validate(attribute),
          undefined,
        ),
      };
    }, {});

    if (isEmpty(allErrors)) { return undefined; }

    return allErrors;
  },
});

const NameGeneratorPrompt = ({ handleValidateAttributes, fieldId, form, nodeType, ...rest }) => (
  <Item {...rest}>
    <div id={getFieldId(`${fieldId}.text`)} data-name="Prompt text" />
    <h3>Text for Prompt</h3>
    <ValidatedField
      name={`${fieldId}.text`}
      component={TextArea}
      className="stage-editor-section-prompt__textarea"
      label=""
      placeholder="Enter text for the prompt here"
      validation={{ required: true }}
    />
    <div id={getFieldId(`${fieldId}.additionalAttributes`)} data-name="Prompt additional attributes" />
    <h3>Additional attributes</h3>
    <Field
      component={AttributesTable}
      name={`${fieldId}.additionalAttributes`}
      id="additionalAttributes"
      validate={handleValidateAttributes}
      nodeType={nodeType}
    />
  </Item>
);

NameGeneratorPrompt.propTypes = {
  fieldId: PropTypes.string.isRequired,
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
  nodeType: PropTypes.string,
};

NameGeneratorPrompt.defaultProps = {
  nodeType: null,
};

const mapStateToProps = state => ({
  variableRegistry: get(state, 'protocol.present.variableRegistry', {}),
});

export { NameGeneratorPrompt };

export default compose(
  connect(mapStateToProps),
  withValidation,
)(NameGeneratorPrompt);
