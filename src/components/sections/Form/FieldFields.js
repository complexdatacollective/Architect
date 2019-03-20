import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { getFieldId } from '../../../utils/issues';
import { ValidatedField } from '../../Form';
import TextArea from '../../../ui/components/Fields/TextArea';
import Select from '../../Form/Fields/Select';
import Validations from '../../Validations';
import { Row } from '../../OrderedList';
import SelectOptionImage from '../../Form/Fields/SelectOptionImage';
import inputOptions from './inputOptions';

/**
 *  "variable": "2377af3f-3c79-41da-9b0b-6570fb519b93",
    "component": "Text",
    "prompt": "What is this person's name?",
    // reset if input changes
    "validation": {
      "required": true,
      "minLength": 30,
    },
 */

const PromptFields = ({ form }) => (
  <React.Fragment>
    <Row>
      <h3 id={getFieldId('prompt')}>Prompt</h3>
      <ValidatedField
        name="prompt"
        component={TextArea}
        placeholder="e.g. What is this person's name?"
        validation={{ required: true }}
      />
    </Row>
    <Row>
      <h3 id={getFieldId('component')}>Component</h3>
      <ValidatedField
        name="component"
        component={Select}
        placeholder="Select component"
        options={inputOptions}
        selectOptionComponent={SelectOptionImage}
        validation={{ required: true }}
      />
    </Row>
    <Row>
      <h3 id={getFieldId('validation')}>Validation</h3>
      <Validations
        form={form}
        name="validation"
        variableType="text"
      />
    </Row>
  </React.Fragment>
);

PromptFields.propTypes = {};

PromptFields.defaultProps = {};

export { PromptFields };

export default PromptFields;
