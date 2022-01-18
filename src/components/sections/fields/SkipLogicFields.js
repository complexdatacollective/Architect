import React from 'react';
import { Field } from 'redux-form';
import RadioGroup from '@codaco/ui/lib/components/Fields/RadioGroup';
import ValidatedField from '@components/Form/ValidatedField';
import {
  Query, withStoreConnector, withFieldConnector, ruleValidator,
} from '@components/Query';
import { Row } from '@components/EditorLayout';
import { getFieldId } from '../../../utils/issues';

const ConnectedQuery = withFieldConnector(withStoreConnector(Query));
const SkipLogicFields = () => (
  <>
    <Row>
      <div id={getFieldId('skipLogic.action')} data-name="Skip Logic Action" />
      <ValidatedField
        className="form-fields-select"
        component={RadioGroup}
        name="skipLogic.action"
        options={[
          { value: 'SHOW', label: 'Show this stage if' },
          { value: 'SKIP', label: 'Skip this stage if' },
        ]}
        validation={{ required: true }}
      />
    </Row>
    <Row>
      <Field
        component={ConnectedQuery}
        name="skipLogic.filter"
        validate={ruleValidator}
      />
    </Row>
  </>
);

export default SkipLogicFields;
