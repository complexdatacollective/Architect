import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { getFieldId } from '../../../../utils/issues';
import { ValidatedField } from '../../../Form';
import TextArea from '../../../../ui/components/Fields/TextArea';
import Select from '../../../Form/Fields/Select';
import ColorPicker from '../../../Form/Fields/ColorPicker';
import MultiSelect from '../../../Form/MultiSelect';
import { Row } from '../../../OrderedList';
import Form from '../../../Prompts/PromptForm';
import {
  optionGetters,
  withVariableOptions,
} from '../CategoricalBinPrompts';

class PromptForm extends Form {
  form() {
    const {
      fieldId,
      variableOptions,
    } = this.props;

    const ordinalVariableOptions = variableOptions
      .filter(({ type }) => type === 'ordinal');

    return (
      <div>
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
          <h3 id={getFieldId(`${fieldId}.variable`)}>Ordinal variable</h3>
          <ValidatedField
            name={`${fieldId}.variable`}
            component={Select}
            label=""
            options={ordinalVariableOptions}
            validation={{ required: true }}
          />
        </Row>
        <Row>
          <h3 id={getFieldId(`${fieldId}.color`)}>Color</h3>
          <p>What color would you like to use for the gradient?</p>
          <ValidatedField
            component={ColorPicker}
            name={`${fieldId}.color`}
            palette="ord-color-seq"
            paletteRange={8}
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
            options={optionGetters.getSortOrderOptionGetter(variableOptions)}
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
            options={optionGetters.getSortOrderOptionGetter(variableOptions)}
          />
        </Row>
      </div>
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
