import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { getFieldId } from '../../../../utils/issues';
import { ValidatedField } from '../../../Form';
import TextArea from '../../../../ui/components/Fields/TextArea';
import Select from '../../../Form/Fields/Select';
import ColorPicker from '../../../Form/Fields/ColorPicker';
import MultiSelect from '../../../Form/MultiSelect';
import { Row } from '../../../OrderedList';
import {
  optionGetters,
  withVariableOptions,
} from '../CategoricalBinPrompts';

class PromptFields extends PureComponent {
  render() {
    const {
      variableOptions,
    } = this.props;

    const ordinalVariableOptions = variableOptions
      .filter(({ type }) => type === 'ordinal');

    return (
      <div>
        <Row>
          <h3 id={getFieldId('text')}>Text for Prompt</h3>
          <ValidatedField
            name="text"
            component={TextArea}
            label=""
            placeholder="Enter text for the prompt here"
            validation={{ required: true }}
          />
        </Row>
        <div id={getFieldId('variable')} data-name="Variable" />
        <Row>
          <ValidatedField
            name="variable"
            component={Select}
            label=""
            options={ordinalVariableOptions}
            validation={{ required: true }}
          />
        </Row>
        <Row>
          <div id={getFieldId('color')} data-name="Gradient color" />
          <p>What color would you like to use for the gradient?</p>
          <ValidatedField
            component={ColorPicker}
            name="color"
            palette="ord-color-seq"
            paletteRange={8}
            validation={{ required: true }}
          />
        </Row>
        <Row>
          <h3>Bin Sort Order</h3>
          <p>How would you like to sort the node categories?</p>
          <MultiSelect
            name="binSortOrder"
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
            name="bucketSortOrder"
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

PromptFields.propTypes = {
  variableOptions: PropTypes.array,
};

PromptFields.defaultProps = {
  variableOptions: [],
};

export { PromptFields };

export default compose(
  withVariableOptions,
)(PromptFields);
