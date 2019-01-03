import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Field } from 'redux-form';
import Markdown from 'react-markdown';
import { ValidatedField } from '../../../Form';
import Select from '../../../Form/Fields/Select';
import { TextArea } from '../../../../ui/components/Fields';
import MultiSelect from '../../../Form/MultiSelect';
import { ExpandableItem, Row } from '../../../OrderedList';
import { getFieldId } from '../../../../utils/issues';
import { getSortOrderOptionGetter } from './optionGetters';
import withVariableOptions from './withVariableOptions';

const CategoricalBinPrompt = ({
  fieldId,
  form,
  variableOptions,
  categoricalVariableOptions,
  ...rest
}) => (
  <ExpandableItem
    {...rest}
    preview={(
      <div className="stage-editor-section-prompt__preview--centered">
        <Field
          name={`${fieldId}.text`}
          component={field => <Markdown source={field.input.value} />}
        />
      </div>
    )}
  >
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
  </ExpandableItem>
);

CategoricalBinPrompt.propTypes = {
  fieldId: PropTypes.string.isRequired,
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
  nodeType: PropTypes.string,
};

CategoricalBinPrompt.defaultProps = {
  nodeType: null,
  variableOptions: [],
};

export { CategoricalBinPrompt };

export default compose(
  withVariableOptions,
)(CategoricalBinPrompt);
