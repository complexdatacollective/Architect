import React from 'react';
import RadioGroup from '@codaco/ui/lib/components/Fields/RadioGroup';
import ValidatedField from '@components/Form/ValidatedField';
import {
  Query, withStoreConnector, withFieldConnector, ruleValidator,
} from '@components/Query';
import { Row } from '@components/EditorLayout';

const ConnectedQuery = withFieldConnector(withStoreConnector(Query));
const SkipLogicFields = () => (
  <>
    <Row>
      <ValidatedField
        className="form-fields-select"
        component={RadioGroup}
        issueDescription="Skip Logic Action"
        name="skipLogic.action"
        options={[
          { value: 'SHOW', label: 'Show this stage if' },
          { value: 'SKIP', label: 'Skip this stage if' },
        ]}
        validation={{ required: true }}
      />
    </Row>
    <Row>
      <ValidatedField
        component={ConnectedQuery}
        issueDescription="Skip Logic Rules"
        name="skipLogic.filter"
        validation={{ required: true, validator: ruleValidator }}
      />
    </Row>
  </>
);

export default SkipLogicFields;
