import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Field } from 'redux-form';
import Markdown from 'react-markdown';
import { ValidatedField } from '../../../Form';
import { TextArea } from '../../../../ui/components/Fields';
import MultiSelect from '../../../Form/MultiSelect';
import { ExpandableItem, Row, Group } from '../../../OrderedList';
import { getFieldId } from '../../../../utils/issues';
import { getSortOrderOptionsGetter } from './optionGetters';
import withVariableOptions from './withVariableOptions';

const CategoricalBinPrompt = ({
  fieldId,
  form,
  variableOptions,
  ...rest
}) => {
  // TODO: does this need a return?

  return (
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

      <Group>
        <Row>
          <h3>Sort options</h3>
          <p>
            How would you like to sort the nodes?
          </p>
        </Row>
        <Row>
          <h4>Bucket Sort Order</h4>
          <p>How would you like to sort the unplaced nodes?</p>
          <MultiSelect
            name={`${fieldId}.bucketSortOrder`}
            properties={[
              { fieldName: 'property' },
              { fieldName: 'direction' },
            ]}
            options={getSortOrderOptionsGetter(variableOptions)}
          />
        </Row>
        <Row>
          <h4>Bin Sort Order</h4>
          <p>How would you like to sort the node categories?</p>
          <MultiSelect
            name={`${fieldId}.binSortOrder`}
            properties={[
              { fieldName: 'property' },
              { fieldName: 'direction' },
            ]}
            options={getSortOrderOptionsGetter(variableOptions)}
          />
        </Row>
      </Group>
    </ExpandableItem>
  );
};

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
