import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { ValidatedField } from '../../../Form';
import Select from '../../../Form/Fields/Select';
import { TextArea } from '../../../../ui/components/Fields';
import MultiSelect from '../../../Form/MultiSelect';
import { Row } from '../../../OrderedList';
import { getFieldId } from '../../../../utils/issues';
import Form from '../../../Prompts/PromptForm';
import { getSortOrderOptionGetter } from './optionGetters';
import withVariableOptions from './withVariableOptions';

class PromptForm extends Form {
  form() {
    const {
      fieldId,
      variableOptions,
    } = this.props;

    const categoricalVariableOptions = variableOptions
      .filter(({ type }) => type === 'categorical');

    return (
      <React.Fragment>
        <Row>
          <div id={getFieldId(`${fieldId}.text`)} data-name="Prompt text" />
          <h3>Text for Prompt</h3>
          <ValidatedField
            name={`${fieldId}.text`}
            component={TextArea}
            label=""
            placeholder="Enter text for the prompt here"
            validation={{ required: true }}
          />
        </Row>
        <Row>
          <h3 id={getFieldId(`${fieldId}.variable`)}>Category variable</h3>
          <ValidatedField
            name={`${fieldId}.variable`}
            component={Select}
            label=""
            options={categoricalVariableOptions}
            validation={{ required: true }}
          />
        </Row>
        <Row>
          <h3>Bin Sort Order</h3>
          <p>How would you like to sort the node categories?</p>
          <MultiSelect
            name={`${fieldId}.binSortOrder`}
            properties={[
              { fieldName: 'property' },
              { fieldName: 'direction' },
            ]}
            options={getSortOrderOptionGetter(variableOptions)}
          />
        </Row>
        <Row>
          <h3>Bucket Sort Order</h3>
          <p>How would you like to sort the unplaced nodes?</p>
          <MultiSelect
            name={`${fieldId}.bucketSortOrder`}
            properties={[
              { fieldName: 'property' },
              { fieldName: 'direction' },
            ]}
            options={getSortOrderOptionGetter(variableOptions)}
          />
        </Row>
      </React.Fragment>
    );
  }
}

PromptForm.propTypes = {
  fieldId: PropTypes.string.isRequired,
  variableOptions: PropTypes.array,
};

PromptForm.defaultProps = {
  variableOptions: [],
};

export { PromptForm };

export default compose(
  withVariableOptions,
)(PromptForm);
